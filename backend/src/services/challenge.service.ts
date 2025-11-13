import { PrismaClient, ChallengeType, ChallengeStatus } from '@prisma/client';
import { PointsService } from './points.service';

const prisma = new PrismaClient();

export interface CreateChallengeData {
  title: string;
  description: string;
  type: ChallengeType;
  requiredCount: number;
  pointReward: number;
  bonusReward?: number;
  icon?: string;
  difficulty?: string;
  category: string;
  startDate?: Date;
  endDate?: Date;
}

export class ChallengeService {
  /**
   * Create a new challenge
   */
  static async createChallenge(data: CreateChallengeData) {
    return await prisma.challenge.create({
      data: {
        ...data,
        isActive: true,
      },
    });
  }

  /**
   * Get all active challenges
   */
  static async getActiveChallenges(category?: string) {
    const where: any = { isActive: true };
    
    if (category) {
      where.category = category;
    }

    // Check for time-based challenges
    const now = new Date();
    where.OR = [
      { startDate: null },
      { startDate: { lte: now } },
    ];

    return await prisma.challenge.findMany({
      where,
      orderBy: [
        { type: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  /**
   * Get user's challenges
   */
  static async getUserChallenges(userId: string, status?: ChallengeStatus) {
    const where: any = { userId };
    
    if (status) {
      where.status = status;
    }

    return await prisma.userChallenge.findMany({
      where,
      include: {
        challenge: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Enroll user in a challenge
   */
  static async enrollInChallenge(userId: string, challengeId: string) {
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge || !challenge.isActive) {
      throw new Error('Challenge not found or inactive');
    }

    // Check if user already enrolled
    const existing = await prisma.userChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
    });

    if (existing) {
      throw new Error('Already enrolled in this challenge');
    }

    // Get user points record
    const userPoints = await prisma.userPoints.findUnique({
      where: { userId },
    });

    if (!userPoints) {
      throw new Error('User points not initialized');
    }

    return await prisma.userChallenge.create({
      data: {
        userId,
        challengeId,
        userPointsId: userPoints.id,
        status: ChallengeStatus.ACTIVE,
        progress: 0,
      },
      include: {
        challenge: true,
      },
    });
  }

  /**
   * Update challenge progress
   */
  static async updateProgress(
    userId: string,
    challengeId: string,
    incrementBy: number = 1
  ) {
    const userChallenge = await prisma.userChallenge.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
      include: {
        challenge: true,
      },
    });

    if (!userChallenge) {
      throw new Error('User not enrolled in this challenge');
    }

    if (userChallenge.status !== ChallengeStatus.ACTIVE) {
      throw new Error('Challenge is not active');
    }

    const newProgress = userChallenge.progress + incrementBy;
    const isCompleted = newProgress >= userChallenge.challenge.requiredCount;

    const updated = await prisma.userChallenge.update({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
      data: {
        progress: newProgress,
        ...(isCompleted && {
          status: ChallengeStatus.COMPLETED,
          completedAt: new Date(),
        }),
      },
      include: {
        challenge: true,
      },
    });

    // Award points if completed
    if (isCompleted && userChallenge.status === ChallengeStatus.ACTIVE) {
      let totalReward = userChallenge.challenge.pointReward;

      // Check for bonus (early completion)
      if (userChallenge.challenge.bonusReward && userChallenge.challenge.endDate) {
        const daysRemaining = Math.ceil(
          (userChallenge.challenge.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        if (daysRemaining > 3) {
          totalReward += userChallenge.challenge.bonusReward;
        }
      }

      await PointsService.awardPoints(userId, totalReward, {
        reason: 'CHALLENGE_COMPLETE',
        description: `Completed challenge: ${userChallenge.challenge.title}`,
        metadata: {
          challengeId,
          challengeTitle: userChallenge.challenge.title,
          difficulty: userChallenge.challenge.difficulty,
        },
      });

      await prisma.userChallenge.update({
        where: { id: userChallenge.id },
        data: { pointsEarned: totalReward },
      });
    }

    return {
      ...updated,
      isCompleted,
      pointsEarned: isCompleted ? userChallenge.challenge.pointReward : 0,
    };
  }

  /**
   * Track activity and update relevant challenges
   */
  static async trackActivity(
    userId: string,
    activityType: string,
    metadata?: any
  ) {
    // Get user's active challenges
    const userChallenges = await this.getUserChallenges(userId, ChallengeStatus.ACTIVE);

    const updates = [];

    for (const userChallenge of userChallenges) {
      const challenge = userChallenge.challenge;
      let shouldUpdate = false;

      // Check if activity matches challenge category
      switch (challenge.category) {
        case 'MEDITATION':
          if (activityType === 'SESSION_COMPLETE' && metadata?.sessionType === 'MEDITATION') {
            shouldUpdate = true;
          }
          break;
        case 'JOURNALING':
          if (activityType === 'JOURNAL_ENTRY') {
            shouldUpdate = true;
          }
          break;
        case 'SOCIAL':
          if (['COMMUNITY_POST', 'COMMUNITY_COMMENT', 'POST_LIKE'].includes(activityType)) {
            shouldUpdate = true;
          }
          break;
        case 'WELLNESS':
          if (['SESSION_COMPLETE', 'MOOD_CHECKIN', 'GRATITUDE_ENTRY'].includes(activityType)) {
            shouldUpdate = true;
          }
          break;
        case 'STREAKS':
          if (activityType === 'DAILY_CHECKIN') {
            shouldUpdate = true;
          }
          break;
      }

      if (shouldUpdate) {
        const result = await this.updateProgress(userId, challenge.id);
        updates.push(result);
      }
    }

    return updates;
  }

  /**
   * Get challenge details
   */
  static async getChallengeById(challengeId: string) {
    return await prisma.challenge.findUnique({
      where: { id: challengeId },
    });
  }

  /**
   * Get challenge leaderboard (users who completed it)
   */
  static async getChallengeLeaderboard(challengeId: string, limit: number = 50) {
    return await prisma.userChallenge.findMany({
      where: {
        challengeId,
        status: ChallengeStatus.COMPLETED,
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
        completedAt: 'asc', // First to complete ranks higher
      },
      take: limit,
    });
  }

  /**
   * Expire old challenges
   */
  static async expireOldChallenges() {
    const now = new Date();

    // Find active user challenges with expired end dates
    const expiredUserChallenges = await prisma.userChallenge.findMany({
      where: {
        status: ChallengeStatus.ACTIVE,
        challenge: {
          endDate: {
            lt: now,
          },
        },
      },
    });

    // Update them to expired
    for (const uc of expiredUserChallenges) {
      await prisma.userChallenge.update({
        where: { id: uc.id },
        data: { status: ChallengeStatus.EXPIRED },
      });
    }

    return expiredUserChallenges.length;
  }

  /**
   * Get challenge statistics
   */
  static async getChallengeStats(challengeId: string) {
    const totalEnrolled = await prisma.userChallenge.count({
      where: { challengeId },
    });

    const completed = await prisma.userChallenge.count({
      where: { challengeId, status: ChallengeStatus.COMPLETED },
    });

    const active = await prisma.userChallenge.count({
      where: { challengeId, status: ChallengeStatus.ACTIVE },
    });

    const expired = await prisma.userChallenge.count({
      where: { challengeId, status: ChallengeStatus.EXPIRED },
    });

    const completionRate = totalEnrolled > 0 ? (completed / totalEnrolled) * 100 : 0;

    return {
      totalEnrolled,
      completed,
      active,
      expired,
      completionRate: Math.round(completionRate),
    };
  }

  /**
   * Seed initial challenges
   */
  static async seedChallenges() {
    const challenges = [
      // Daily Challenges
      {
        title: '5-Minute Meditation Master',
        description: 'Complete 5 meditation sessions today',
        type: ChallengeType.DAILY,
        requiredCount: 5,
        pointReward: 100,
        category: 'MEDITATION',
        difficulty: 'MEDIUM',
        icon: '🧘',
      },
      {
        title: 'Gratitude Warrior',
        description: 'Log 3 gratitude entries today',
        type: ChallengeType.DAILY,
        requiredCount: 3,
        pointReward: 50,
        category: 'WELLNESS',
        difficulty: 'EASY',
        icon: '🙏',
      },
      
      // Weekly Challenges
      {
        title: 'Consistency Champion',
        description: 'Maintain a 7-day streak',
        type: ChallengeType.WEEKLY,
        requiredCount: 7,
        pointReward: 300,
        bonusReward: 100,
        category: 'STREAKS',
        difficulty: 'MEDIUM',
        icon: '🔥',
      },
      {
        title: 'Community Connector',
        description: 'Create 5 community posts this week',
        type: ChallengeType.WEEKLY,
        requiredCount: 5,
        pointReward: 200,
        category: 'SOCIAL',
        difficulty: 'EASY',
        icon: '💬',
      },
      {
        title: 'Journal Journey',
        description: 'Write 10 journal entries this week',
        type: ChallengeType.WEEKLY,
        requiredCount: 10,
        pointReward: 250,
        category: 'JOURNALING',
        difficulty: 'MEDIUM',
        icon: '📝',
      },
      
      // Monthly Challenges
      {
        title: 'Meditation Marathon',
        description: 'Complete 30 meditation sessions this month',
        type: ChallengeType.MONTHLY,
        requiredCount: 30,
        pointReward: 1000,
        bonusReward: 500,
        category: 'MEDITATION',
        difficulty: 'HARD',
        icon: '🏆',
      },
      {
        title: 'Wellness Warrior',
        description: 'Complete 50 wellness activities this month',
        type: ChallengeType.MONTHLY,
        requiredCount: 50,
        pointReward: 1500,
        category: 'WELLNESS',
        difficulty: 'HARD',
        icon: '⭐',
      },
      
      // Milestone Challenges
      {
        title: 'First Steps',
        description: 'Complete your first meditation session',
        type: ChallengeType.MILESTONE,
        requiredCount: 1,
        pointReward: 50,
        category: 'MEDITATION',
        difficulty: 'EASY',
        icon: '🌟',
      },
      {
        title: 'Century Club',
        description: 'Complete 100 total sessions',
        type: ChallengeType.MILESTONE,
        requiredCount: 100,
        pointReward: 2000,
        category: 'MEDITATION',
        difficulty: 'HARD',
        icon: '💯',
      },
    ];

    const created = [];
    for (const challenge of challenges) {
      const existing = await prisma.challenge.findFirst({
        where: { title: challenge.title },
      });

      if (!existing) {
        const newChallenge = await this.createChallenge(challenge);
        created.push(newChallenge);
      }
    }

    return created;
  }
}
