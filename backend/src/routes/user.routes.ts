import { Router } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth.js';
import prisma from '../config/database.js';
import { cacheService } from '../config/redis.js';
import { Response } from 'express';

const router = Router();

router.use(authenticate);

router.post('/setup', async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      goals,
      sessionLength,
      checkInTimes,
      lifestyle,
      supportPreferences,
      experienceLevel,
      notificationPreferences,
      wakeTime,
      morningWellnessEnabled
    } = req.body as any;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        name,
        goals,
        sessionLength,
        checkInTimes,
        wakeTime,
        morningWellnessEnabled,
        lifestyle,
        supportPreferences,
        experienceLevel,
        notificationsEnabled: notificationPreferences?.enabled || false
      },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        bio: true,
        sessionLength: true,
        goals: true,
        checkInTimes: true,
        lifestyle: true,
        subscriptionTier: true,
        xp: true,
        level: true,
        streak: true,
        lastSessionDate: true,
        totalSessionsCompleted: true,
        totalMinutesMeditated: true,
        notificationsEnabled: true,
        supportPreferences: true,
        experienceLevel: true
      }
    });

    await cacheService.delPattern(`user:${req.user!.id}:*`);

    res.json({ status: 'success', data: user });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to complete setup' });
  }
});

router.get('/me', async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      id: true,
      email: true,
      name: true,
      profilePicture: true,
      bio: true,
      sessionLength: true,
      goals: true,
      checkInTimes: true,
      lifestyle: true,
      subscriptionTier: true,
      xp: true,
      level: true,
      streak: true,
      lastSessionDate: true,
      totalSessionsCompleted: true,
      totalMinutesMeditated: true,
      notificationsEnabled: true,
      emailVerified: true,
      createdAt: true
    }
  });
  res.json({ status: 'success', data: user });
});

router.patch('/me', async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.update({
    where: { id: req.user!.id },
    data: req.body as any,
    select: {
      id: true,
      email: true,
      name: true,
      profilePicture: true,
      bio: true,
      sessionLength: true,
      goals: true,
      lifestyle: true,
      subscriptionTier: true
    }
  });
  
  await cacheService.delPattern(`user:${req.user!.id}:*`);
  
  res.json({ status: 'success', data: user });
});

router.get('/me/stats', async (req: AuthRequest, res: Response) => {
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

  const achievements = await prisma.userAchievement.count({
    where: { userId: req.user!.id }
  });

  res.json({
    status: 'success',
    data: {
      ...user,
      achievementsUnlocked: achievements
    }
  });
});

// Add XP
router.post('/xp', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { amount } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { xp: true, level: true }
    });

    if (!user) {
      res.status(404).json({ status: 'error', message: 'User not found' });
      return;
    }

    const newXP = user.xp + amount;
    const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;

    const updatedUser = await prisma.user.update({
      where: { id: req.user!.id },
      data: { xp: newXP, level: newLevel },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        bio: true,
        sessionLength: true,
        goals: true,
        checkInTimes: true,
        lifestyle: true,
        subscriptionTier: true,
        xp: true,
        level: true,
        streak: true,
        lastSessionDate: true,
        totalSessionsCompleted: true,
        totalMinutesMeditated: true,
        notificationsEnabled: true,
        emailVerified: true,
        createdAt: true
      }
    });

    await cacheService.delPattern(`user:${req.user!.id}:*`);

    res.json({ status: 'success', data: updatedUser });
  } catch (error) {
    console.error('Add XP error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to add XP' });
  }
});

// Add session to history (for journal/gratitude entries)
router.post('/sessions', async (req: AuthRequest, res: Response) => {
  try {
    const { date, mood, reflection } = req.body;
    
    // This is a simplified session history entry
    // The main sessions are tracked via the session.routes.ts
    const session = {
      date,
      mood,
      reflection,
      userId: req.user!.id
    };

    await cacheService.delPattern(`user:${req.user!.id}:*`);

    res.json({ status: 'success', data: session });
  } catch (error) {
    console.error('Add session error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to add session' });
  }
});

// Get gratitude entries
router.get('/gratitude', async (req: AuthRequest, res: Response) => {
  try {
    const entries = await prisma.gratitudeEntry.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        word: true,
        createdAt: true
      }
    });

    // Map to match frontend GratitudeEntry type
    const formattedEntries = entries.map(entry => ({
      word: entry.word,
      date: entry.createdAt.toISOString()
    }));

    res.json(formattedEntries);
  } catch (error) {
    console.error('Get gratitude entries error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch gratitude entries' });
  }
});

// Add gratitude entry
router.post('/gratitude', async (req: AuthRequest, res: Response) => {
  try {
    const { word } = req.body;

    if (!word || typeof word !== 'string' || word.trim().length === 0) {
      res.status(400).json({ status: 'error', message: 'Invalid gratitude word' });
      return;
    }

    const entry = await prisma.gratitudeEntry.create({
      data: {
        userId: req.user!.id,
        word: word.trim()
      },
      select: {
        id: true,
        word: true,
        createdAt: true
      }
    });

    await cacheService.delPattern(`user:${req.user!.id}:*`);

    // Return in format expected by frontend
    const formattedEntry = {
      word: entry.word,
      date: entry.createdAt.toISOString()
    };

    res.json(formattedEntry);
  } catch (error) {
    console.error('Add gratitude entry error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to add gratitude entry' });
  }
});

export default router;
