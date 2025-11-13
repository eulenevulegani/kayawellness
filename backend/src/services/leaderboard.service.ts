import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type LeaderboardTimeframe = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ALL_TIME';

export class LeaderboardService {
  /**
   * Update leaderboards (run periodically via cron)
   */
  static async updateLeaderboards() {
    await Promise.all([
      this.updateTimeframeLeaderboard('DAILY'),
      this.updateTimeframeLeaderboard('WEEKLY'),
      this.updateTimeframeLeaderboard('MONTHLY'),
      this.updateTimeframeLeaderboard('ALL_TIME'),
    ]);
  }

  /**
   * Update leaderboard for specific timeframe
   */
  private static async updateTimeframeLeaderboard(timeframe: LeaderboardTimeframe) {
    // Get all users with points
    const userPoints = await prisma.userPoints.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        totalPoints: 'desc',
      },
    });

    // Clear old entries for this timeframe
    await prisma.leaderboard.deleteMany({
      where: { timeframe },
    });

    // Create new entries with rankings
      const entries = userPoints.map((up, index) => ({
      userId: up.userId,
      username: up.user.name,
      totalPoints: up.totalPoints,
      currentStreak: up.currentStreak,
      rank: index + 1,
      timeframe,
    }));    if (entries.length > 0) {
      await prisma.leaderboard.createMany({
        data: entries,
      });
    }

    return entries.length;
  }

  /**
   * Get leaderboard for timeframe
   */
  static async getLeaderboard(timeframe: LeaderboardTimeframe, limit: number = 100) {
    return await prisma.leaderboard.findMany({
      where: { timeframe },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        rank: 'asc',
      },
      take: limit,
    });
  }

  /**
   * Get user's position in leaderboard
   */
  static async getUserPosition(userId: string, timeframe: LeaderboardTimeframe) {
    const entry = await prisma.leaderboard.findUnique({
      where: {
        userId_timeframe: {
          userId,
          timeframe,
        },
      },
    });

    if (!entry) {
      return null;
    }

    // Get users around this rank
    const around = await prisma.leaderboard.findMany({
      where: {
        timeframe,
        rank: {
          gte: Math.max(1, entry.rank - 5),
          lte: entry.rank + 5,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        rank: 'asc',
      },
    });

    return {
      userEntry: entry,
      around,
    };
  }

  /**
   * Get top performers (highest gainers)
   */
  static async getTopGainers(days: number = 7, limit: number = 10) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const transactions = await prisma.pointTransaction.findMany({
      where: {
        createdAt: {
          gte: since,
        },
        points: {
          gt: 0, // Only earnings, not spending
        },
      },
    });

    // Group by user and sum points
    const userTotals = transactions.reduce((acc, t) => {
      if (!acc[t.userId]) {
        acc[t.userId] = 0;
      }
      acc[t.userId] += t.points;
      return acc;
    }, {} as Record<string, number>);

    // Sort by points gained
    const sorted = Object.entries(userTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit);

    // Get user details
    const results = await Promise.all(
      sorted.map(async ([userId, points]) => {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        });
        return {
          user,
          pointsGained: points,
          rank: sorted.findIndex(([uid]) => uid === userId) + 1,
        };
      })
    );

    return results;
  }

  /**
   * Get streak leaderboard
   */
  static async getStreakLeaderboard(limit: number = 100) {
    return await prisma.userPoints.findMany({
      where: {
        currentStreak: {
          gt: 0,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
      orderBy: [
        { currentStreak: 'desc' },
        { longestStreak: 'desc' },
      ],
      take: limit,
    });
  }

  /**
   * Get top earners leaderboard (by total points earned)
   */
  static async getTopEarnersLeaderboard(limit: number = 100) {
    return await prisma.userPoints.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
      orderBy: [
        { lifetimeEarned: 'desc' },
        { totalPoints: 'desc' },
      ],
      take: limit,
    });
  }

  /**
   * Get challenge completion leaderboard
   */
  static async getChallengeLeaderboard(limit: number = 100) {
    const users = await prisma.user.findMany({
      include: {
        userChallenges: {
          where: {
            status: 'COMPLETED',
          },
        },
        userPoints: {
          select: {
            id: true,
            totalPoints: true,
            level: true,
          },
        },
      },
    });

    const leaderboard = users
      .map(user => ({
        userId: user.id,
        name: user.name,
        profilePicture: user.profilePicture,
        challengesCompleted: user.userChallenges.length,
        totalPoints: user.userPoints?.totalPoints || 0,
        level: user.userPoints?.level || 1,
      }))
      .sort((a, b) => b.challengesCompleted - a.challengesCompleted)
      .slice(0, limit)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

    return leaderboard;
  }

  /**
   * Get global statistics
   */
  static async getGlobalStats() {
    const totalUsers = await prisma.user.count();
    
    const totalPoints = await prisma.userPoints.aggregate({
      _sum: {
        totalPoints: true,
        lifetimeEarned: true,
      },
    });

    const totalChallenges = await prisma.userChallenge.count({
      where: {
        status: 'COMPLETED',
      },
    });

    const totalRedemptions = await prisma.redemption.count();

    const avgStreak = await prisma.userPoints.aggregate({
      _avg: {
        currentStreak: true,
        longestStreak: true,
      },
    });

    const longestStreak = await prisma.userPoints.findFirst({
      orderBy: {
        longestStreak: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    const highestLevel = await prisma.userPoints.findFirst({
      orderBy: {
        level: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            profilePicture: true,
          },
        },
      },
    });

    return {
      totalUsers,
      totalPointsInCirculation: totalPoints._sum.totalPoints || 0,
      totalPointsEarned: totalPoints._sum.lifetimeEarned || 0,
      totalChallengesCompleted: totalChallenges,
      totalRedemptions,
      averageStreak: Math.round(avgStreak._avg.currentStreak || 0),
      averageLongestStreak: Math.round(avgStreak._avg.longestStreak || 0),
      longestStreakHolder: longestStreak ? {
        name: longestStreak.user.name,
        profilePicture: longestStreak.user.profilePicture,
        streak: longestStreak.longestStreak,
      } : null,
      highestLevelPlayer: highestLevel ? {
        name: highestLevel.user.name,
        profilePicture: highestLevel.user.profilePicture,
        level: highestLevel.level,
      } : null,
    };
  }

  /**
   * Get user's achievements summary
   */
  static async getUserAchievementsSummary(userId: string) {
    const userPoints = await prisma.userPoints.findUnique({
      where: { userId },
    });

    if (!userPoints) {
      return null;
    }

    const completedChallenges = await prisma.userChallenge.count({
      where: {
        userId,
        status: 'COMPLETED',
      },
    });

    const redemptions = await prisma.redemption.count({
      where: { userId },
    });

    const recentTransactions = await prisma.pointTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Get rank across different timeframes
    const ranks = await Promise.all([
      this.getUserPosition(userId, 'ALL_TIME'),
      this.getUserPosition(userId, 'MONTHLY'),
      this.getUserPosition(userId, 'WEEKLY'),
    ]);

    // Get next milestone
    const milestones = [1000, 2500, 5000, 10000, 25000, 50000];
    const nextMilestone = milestones.find(m => m > userPoints.totalPoints) || null;

    return {
      points: {
        total: userPoints.totalPoints,
        available: userPoints.availablePoints,
        earned: userPoints.lifetimeEarned,
        spent: userPoints.lifetimeSpent,
      },
      nextMilestone,
      streak: {
        current: userPoints.currentStreak,
        longest: userPoints.longestStreak,
        lastCheckIn: userPoints.lastCheckIn,
      },
      challenges: {
        completed: completedChallenges,
      },
      redemptions: {
        total: redemptions,
      },
      rankings: {
        allTime: ranks[0]?.userEntry?.rank || null,
        monthly: ranks[1]?.userEntry?.rank || null,
        weekly: ranks[2]?.userEntry?.rank || null,
      },
      recentActivity: recentTransactions,
    };
  }
}
