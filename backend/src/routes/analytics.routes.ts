import { Router } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth.js';
import prisma from '../config/database.js';
import { Response } from 'express';

const router = Router();

router.use(authenticate);

router.get('/dashboard', async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      xp: true,
      level: true,
      streak: true,
      totalSessionsCompleted: true,
      totalMinutesMeditated: true,
      lastSessionDate: true
    }
  });

  const recentSessions = await prisma.session.findMany({
    where: {
      userId: req.user!.id,
      completed: true
    },
    orderBy: { completedAt: 'desc' },
    take: 10,
    select: {
      activityType: true,
      durationMinutes: true,
      completedAt: true,
      mood: true,
      rating: true
    }
  });

  const achievements = await prisma.userAchievement.count({
    where: { userId: req.user!.id }
  });

  res.json({
    status: 'success',
    data: {
      user,
      recentSessions,
      achievementsCount: achievements
    }
  });
});

router.get('/mood-trends', async (req: AuthRequest, res: Response) => {
  const days = parseInt(req.query.days as string) || 30;
  
  const moodEntries = await prisma.moodEntry.findMany({
    where: {
      userId: req.user!.id,
      createdAt: {
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      }
    },
    orderBy: { createdAt: 'asc' },
    select: {
      mood: true,
      intensity: true,
      createdAt: true
    }
  });

  res.json({ status: 'success', data: moodEntries });
});

router.get('/activity-breakdown', async (req: AuthRequest, res: Response) => {
  const sessions = await prisma.session.groupBy({
    by: ['activityType'],
    where: {
      userId: req.user!.id,
      completed: true
    },
    _count: {
      activityType: true
    },
    _sum: {
      durationMinutes: true
    }
  });

  res.json({ status: 'success', data: sessions });
});

export default router;
