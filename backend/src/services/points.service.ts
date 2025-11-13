import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface PointTransactionData {
  reason: string;
  description?: string;
  metadata?: any;
}

export class PointsService {
  /**
   * Initialize points record for a new user
   */
  static async initializeUserPoints(userId: string) {
    return await prisma.userPoints.create({
      data: {
        userId,
        totalPoints: 0,
        availablePoints: 0,
        lifetimeEarned: 0,
        lifetimeSpent: 0,
        currentStreak: 0,
        longestStreak: 0,
      },
    });
  }

  /**
   * Award points to a user
   */
  static async awardPoints(
    userId: string,
    points: number,
    transactionData: PointTransactionData
  ) {
    const userPoints = await prisma.userPoints.upsert({
      where: { userId },
      create: {
        userId,
        totalPoints: points,
        availablePoints: points,
        lifetimeEarned: points,
        lifetimeSpent: 0,
      },
      update: {
        totalPoints: { increment: points },
        availablePoints: { increment: points },
        lifetimeEarned: { increment: points },
      },
    });

    // Create transaction record
    await prisma.pointTransaction.create({
      data: {
        userId,
        userPointsId: userPoints.id,
        points,
        reason: transactionData.reason,
        description: transactionData.description,
        metadata: transactionData.metadata,
      },
    });

    return await this.getUserPoints(userId);
  }

  /**
   * Deduct points from user (for redemptions)
   */
  static async spendPoints(
    userId: string,
    points: number,
    transactionData: PointTransactionData
  ) {
    const userPoints = await this.getUserPoints(userId);

    if (!userPoints) {
      throw new Error('User points not found');
    }

    if (userPoints.availablePoints < points) {
      throw new Error('Insufficient points');
    }

    const updated = await prisma.userPoints.update({
      where: { userId },
      data: {
        availablePoints: { decrement: points },
        lifetimeSpent: { increment: points },
      },
    });

    // Create transaction record (negative points)
    await prisma.pointTransaction.create({
      data: {
        userId,
        userPointsId: updated.id,
        points: -points,
        reason: transactionData.reason,
        description: transactionData.description,
        metadata: transactionData.metadata,
      },
    });

    return await this.getUserPoints(userId);
  }

  /**
   * Get user's point balance and stats
   */
  static async getUserPoints(userId: string) {
    return await prisma.userPoints.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  /**
   * Get user's transaction history
   */
  static async getTransactionHistory(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ) {
    return await prisma.pointTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * Get milestone bonuses based on total points
   */
  static getMilestoneBonus(totalPoints: number): { milestone: number; bonus: number } | null {
    const milestones = [
      { points: 1000, bonus: 100 },
      { points: 2500, bonus: 250 },
      { points: 5000, bonus: 500 },
      { points: 10000, bonus: 1000 },
      { points: 25000, bonus: 2500 },
    ];

    // Find if user just crossed a milestone
    for (const milestone of milestones) {
      if (totalPoints >= milestone.points && totalPoints < milestone.points + 100) {
        return { milestone: milestone.points, bonus: milestone.bonus };
      }
    }
    return null;
  }

  /**
   * Get leaderboard (top users by points)
   */
  static async getTopUsers(limit: number = 100) {
    return await prisma.userPoints.findMany({
      take: limit,
      orderBy: [
        { totalPoints: 'desc' },
        { currentStreak: 'desc' },
      ],
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
          },
        },
      },
    });
  }

  /**
   * Get user's rank
   */
  static async getUserRank(userId: string): Promise<number> {
    const userPoints = await this.getUserPoints(userId);
    if (!userPoints) return 0;

    const higherRanked = await prisma.userPoints.count({
      where: {
        totalPoints: {
          gt: userPoints.totalPoints,
        },
      },
    });

    return higherRanked + 1;
  }

  /**
   * Award points for different activities
   */
  static async awardActivityPoints(userId: string, activityType: string, metadata?: any) {
    const pointsMap: Record<string, { points: number; description: string }> = {
      SESSION_COMPLETE: { points: 50, description: 'Completed a wellness session' },
      JOURNAL_ENTRY: { points: 20, description: 'Created a journal entry' },
      MOOD_CHECKIN: { points: 10, description: 'Logged daily mood' },
      GRATITUDE_ENTRY: { points: 15, description: 'Shared gratitude' },
      COMMUNITY_POST: { points: 25, description: 'Created a community post' },
      COMMUNITY_COMMENT: { points: 10, description: 'Commented on a post' },
      POST_LIKE: { points: 5, description: 'Liked a community post' },
      DAILY_CHECKIN: { points: 10, description: 'Daily check-in' },
      PROGRAM_ENROLLMENT: { points: 30, description: 'Enrolled in a program' },
      ACHIEVEMENT_UNLOCK: { points: 100, description: 'Unlocked an achievement' },
      EVENT_REGISTRATION: { points: 20, description: 'Registered for an event' },
      EVENT_ATTENDANCE: { points: 50, description: 'Attended an event' },
      THERAPIST_SESSION: { points: 75, description: 'Completed therapist session' },
      PROFILE_COMPLETE: { points: 50, description: 'Completed your profile' },
      FRIEND_REFERRAL: { points: 200, description: 'Referred a friend' },
    };

    const activity = pointsMap[activityType];
    if (!activity) {
      throw new Error(`Unknown activity type: ${activityType}`);
    }

    return await this.awardPoints(userId, activity.points, {
      reason: activityType,
      description: activity.description,
      metadata,
    });
  }

  /**
   * Get points summary with statistics
   */
  static async getPointsSummary(userId: string) {
    const userPoints = await this.getUserPoints(userId);
    if (!userPoints) return null;

    const rank = await this.getUserRank(userId);
    const recentTransactions = await this.getTransactionHistory(userId, 10);
    
    // Get next milestone
    const milestones = [1000, 2500, 5000, 10000, 25000, 50000];
    const nextMilestone = milestones.find(m => m > userPoints.totalPoints) || null;

    return {
      ...userPoints,
      rank,
      nextMilestone,
      recentTransactions,
    };
  }
}
