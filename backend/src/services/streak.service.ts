import { PrismaClient } from '@prisma/client';
import { PointsService } from './points.service';

const prisma = new PrismaClient();

export class StreakService {
  /**
   * Check in user for the day and update streak
   */
  static async checkIn(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userPoints = await prisma.userPoints.findUnique({
      where: { userId },
    });

    if (!userPoints) {
      throw new Error('User points not found. Initialize user first.');
    }

    // Check if user already checked in today
    if (userPoints.lastCheckIn) {
      const lastCheckIn = new Date(userPoints.lastCheckIn);
      lastCheckIn.setHours(0, 0, 0, 0);
      
      if (lastCheckIn.getTime() === today.getTime()) {
        return {
          message: 'Already checked in today',
          streak: userPoints.currentStreak,
          pointsEarned: 0,
        };
      }
    }

    // Calculate streak
    let newStreak = 1;
    let streakBonus = 0;

    if (userPoints.lastCheckIn) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const lastCheckIn = new Date(userPoints.lastCheckIn);
      lastCheckIn.setHours(0, 0, 0, 0);

      if (lastCheckIn.getTime() === yesterday.getTime()) {
        // Continuing streak
        newStreak = userPoints.currentStreak + 1;
      } else {
        // Streak broken
        newStreak = 1;
      }
    }

    // Calculate bonus points based on streak milestones
    streakBonus = this.calculateStreakBonus(newStreak);

    // Update user points
    const updatedUserPoints = await prisma.userPoints.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, userPoints.longestStreak),
        lastCheckIn: new Date(),
      },
    });

    // Create or update streak record
    const existingStreak = await prisma.streak.findFirst({
      where: { userId, isBroken: false },
      orderBy: { createdAt: 'desc' },
    });

    if (existingStreak && newStreak > 1) {
      // Update existing streak
      const milestones = this.getMilestones(newStreak);
      await prisma.streak.update({
        where: { id: existingStreak.id },
        data: {
          streakCount: newStreak,
          lastCheckInDate: new Date(),
          streakBonusPoints: existingStreak.streakBonusPoints + streakBonus,
          milestones,
        },
      });
    } else {
      // Create new streak
      await prisma.streak.create({
        data: {
          userId,
          streakCount: newStreak,
          lastCheckInDate: new Date(),
          streakStartDate: new Date(),
          streakBonusPoints: streakBonus,
          milestones: this.getMilestones(newStreak),
        },
      });

      // If there was a previous streak, mark it as broken
      if (existingStreak) {
        await prisma.streak.update({
          where: { id: existingStreak.id },
          data: { isBroken: true },
        });
      }
    }

    // Award points for check-in
    const basePoints = 10;
    const totalPoints = basePoints + streakBonus;

    await PointsService.awardPoints(userId, totalPoints, {
      reason: 'DAILY_CHECKIN',
      description: `Daily check-in (Streak: ${newStreak} days)`,
      metadata: { 
        streak: newStreak,
        basePoints,
        streakBonus,
      },
    });

    return {
      message: 'Check-in successful!',
      streak: newStreak,
      pointsEarned: totalPoints,
      streakBonus,
      nextMilestone: this.getNextMilestone(newStreak),
    };
  }

  /**
   * Calculate bonus points for streak milestones
   */
  static calculateStreakBonus(streakDays: number): number {
    const milestones = [
      { days: 3, bonus: 20 },
      { days: 7, bonus: 50 },
      { days: 14, bonus: 100 },
      { days: 30, bonus: 200 },
      { days: 60, bonus: 400 },
      { days: 100, bonus: 750 },
      { days: 180, bonus: 1500 },
      { days: 365, bonus: 3000 },
    ];

    const milestone = milestones.find(m => m.days === streakDays);
    return milestone ? milestone.bonus : 0;
  }

  /**
   * Get achieved milestones for a streak
   */
  static getMilestones(streakDays: number): number[] {
    const milestoneList = [3, 7, 14, 30, 60, 100, 180, 365];
    return milestoneList.filter(m => streakDays >= m);
  }

  /**
   * Get next milestone for user
   */
  static getNextMilestone(currentStreak: number): { days: number; bonus: number } | null {
    const milestones = [
      { days: 3, bonus: 20 },
      { days: 7, bonus: 50 },
      { days: 14, bonus: 100 },
      { days: 30, bonus: 200 },
      { days: 60, bonus: 400 },
      { days: 100, bonus: 750 },
      { days: 180, bonus: 1500 },
      { days: 365, bonus: 3000 },
    ];

    return milestones.find(m => m.days > currentStreak) || null;
  }

  /**
   * Get user's current streak info
   */
  static async getUserStreak(userId: string) {
    const userPoints = await prisma.userPoints.findUnique({
      where: { userId },
    });

    if (!userPoints) {
      return null;
    }

    const currentStreakRecord = await prisma.streak.findFirst({
      where: { userId, isBroken: false },
      orderBy: { createdAt: 'desc' },
    });

    const nextMilestone = this.getNextMilestone(userPoints.currentStreak);

    return {
      currentStreak: userPoints.currentStreak,
      longestStreak: userPoints.longestStreak,
      lastCheckIn: userPoints.lastCheckIn,
      nextMilestone,
      achievedMilestones: currentStreakRecord?.milestones || [],
      totalBonusEarned: currentStreakRecord?.streakBonusPoints || 0,
    };
  }

  /**
   * Get streak history for user
   */
  static async getStreakHistory(userId: string, limit: number = 10) {
    return await prisma.streak.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Use streak freeze (prevent streak from breaking for 1 day)
   * This could cost points or be earned through achievements
   */
  static async useStreakFreeze(userId: string) {
    const freezeCost = 100; // Cost in points

    const userPoints = await prisma.userPoints.findUnique({
      where: { userId },
    });

    if (!userPoints || userPoints.availablePoints < freezeCost) {
      throw new Error('Insufficient points for streak freeze');
    }

    // Deduct points
    await PointsService.spendPoints(userId, freezeCost, {
      reason: 'STREAK_FREEZE',
      description: 'Used streak freeze protection',
    });

    // Extend last check-in by 1 day
    const newCheckInDate = new Date();
    await prisma.userPoints.update({
      where: { userId },
      data: { lastCheckIn: newCheckInDate },
    });

    return {
      message: 'Streak freeze activated',
      pointsSpent: freezeCost,
    };
  }

  /**
   * Check if user needs to check in (24+ hours since last check-in)
   */
  static async needsCheckIn(userId: string): Promise<boolean> {
    const userPoints = await prisma.userPoints.findUnique({
      where: { userId },
    });

    if (!userPoints || !userPoints.lastCheckIn) {
      return true;
    }

    const now = new Date();
    const lastCheckIn = new Date(userPoints.lastCheckIn);
    const hoursSinceCheckIn = (now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60);

    return hoursSinceCheckIn >= 24;
  }

  /**
   * Get streak leaderboard
   */
  static async getStreakLeaderboard(limit: number = 100) {
    return await prisma.userPoints.findMany({
      take: limit,
      orderBy: [
        { currentStreak: 'desc' },
        { longestStreak: 'desc' },
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
}
