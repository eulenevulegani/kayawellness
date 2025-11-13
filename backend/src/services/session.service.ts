import prisma from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';
import { cacheService } from '../config/redis.js';

export const sessionService = {
  async createSession(userId: string, data: any) {
    const session = await prisma.session.create({
      data: {
        userId,
        ...data
      },
      include: {
        user: {
          select: {
            name: true,
            level: true
          }
        }
      }
    });

    // Invalidate user session cache
    await cacheService.del(`user:${userId}:sessions`);

    return session;
  },

  async getSession(sessionId: string, userId: string) {
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId
      }
    });

    if (!session) {
      throw new NotFoundError('Session not found');
    }

    return session;
  },

  async getUserSessions(userId: string, limit = 20, offset = 0) {
    const cacheKey = `user:${userId}:sessions:${limit}:${offset}`;
    const cached = await cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          activityType: true,
          title: true,
          durationMinutes: true,
          completed: true,
          completedAt: true,
          mood: true,
          rating: true,
          xpEarned: true,
          createdAt: true
        }
      }),
      prisma.session.count({ where: { userId } })
    ]);

    const result = { sessions, total, limit, offset };
    
    // Cache for 5 minutes
    await cacheService.set(cacheKey, result, 300);

    return result;
  },

  async completeSession(sessionId: string, userId: string, completionData: {
    mood?: string;
    reflection?: string;
    rating?: number;
  }) {
    const session = await prisma.session.findFirst({
      where: { id: sessionId, userId }
    });

    if (!session) {
      throw new NotFoundError('Session not found');
    }

    // Calculate XP based on duration
    const xpEarned = Math.floor(session.durationMinutes * 5);

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: {
        completed: true,
        completedAt: new Date(),
        ...completionData,
        xpEarned
      }
    });

    // Update user stats
    await this.updateUserStats(userId, xpEarned, session.durationMinutes);

    // Invalidate caches
    await cacheService.delPattern(`user:${userId}:*`);

    return updatedSession;
  },

  async updateUserStats(userId: string, xpEarned: number, minutesCompleted: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        xp: true,
        level: true,
        streak: true,
        lastSessionDate: true,
        totalSessionsCompleted: true,
        totalMinutesMeditated: true
      }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const newXP = user.xp + xpEarned;
    const newLevel = this.calculateLevel(newXP);
    
    // Calculate streak
    const today = new Date().toDateString();
    const lastSession = user.lastSessionDate ? new Date(user.lastSessionDate).toDateString() : null;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    let newStreak = user.streak;
    if (lastSession === yesterday) {
      newStreak += 1;
    } else if (lastSession !== today) {
      newStreak = 1;
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXP,
        level: newLevel,
        streak: newStreak,
        lastSessionDate: new Date(),
        totalSessionsCompleted: user.totalSessionsCompleted + 1,
        totalMinutesMeditated: user.totalMinutesMeditated + minutesCompleted
      }
    });

    // Check for achievements
    await this.checkAchievements(userId, {
      sessions: user.totalSessionsCompleted + 1,
      streak: newStreak,
      xp: newXP,
      level: newLevel
    });

    return { newLevel, newStreak, xpEarned };
  },

  calculateLevel(xp: number): number {
    // Level formula: level = floor(sqrt(xp / 100))
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  },

  async checkAchievements(userId: string, stats: {
    sessions: number;
    streak: number;
    xp: number;
    level: number;
  }) {
    const achievements = await prisma.achievement.findMany({
      where: {
        OR: [
          { requiredSessions: { lte: stats.sessions } },
          { requiredStreak: { lte: stats.streak } },
          { requiredXP: { lte: stats.xp } },
          { requiredLevel: { lte: stats.level } }
        ]
      }
    });

    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      select: { achievementId: true }
    });

    const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));
    const newAchievements = achievements.filter(a => !unlockedIds.has(a.id));

    if (newAchievements.length > 0) {
      await prisma.userAchievement.createMany({
        data: newAchievements.map(a => ({
          userId,
          achievementId: a.id
        }))
      });
    }

    return newAchievements;
  },

  async getSessionStats(userId: string) {
    const cacheKey = `user:${userId}:stats`;
    const cached = await cacheService.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const [totalSessions, completedSessions, stats] = await Promise.all([
      prisma.session.count({ where: { userId } }),
      prisma.session.count({ where: { userId, completed: true } }),
      prisma.session.aggregate({
        where: { userId, completed: true },
        _sum: { durationMinutes: true, xpEarned: true },
        _avg: { rating: true }
      })
    ]);

    const result = {
      totalSessions,
      completedSessions,
      totalMinutes: stats._sum.durationMinutes || 0,
      totalXP: stats._sum.xpEarned || 0,
      averageRating: stats._avg.rating || 0
    };

    // Cache for 10 minutes
    await cacheService.set(cacheKey, result, 600);

    return result;
  }
};
