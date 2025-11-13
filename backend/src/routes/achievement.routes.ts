import { Router } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth.js';
import prisma from '../config/database.js';
import { Response } from 'express';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response) => {
  const achievements = await prisma.userAchievement.findMany({
    where: { userId: req.user!.id },
    include: { achievement: true },
    orderBy: { unlockedAt: 'desc' }
  });
  res.json({ status: 'success', data: achievements });
});

router.get('/available', async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: {
      totalSessionsCompleted: true,
      streak: true,
      xp: true,
      level: true
    }
  });

  const allAchievements = await prisma.achievement.findMany();
  const unlocked = await prisma.userAchievement.findMany({
    where: { userId: req.user!.id },
    select: { achievementId: true }
  });

  const unlockedIds = new Set(unlocked.map(u => u.achievementId));
  
  const available = allAchievements.map(achievement => ({
    ...achievement,
    unlocked: unlockedIds.has(achievement.id),
    progress: calculateProgress(achievement, user!)
  }));

  res.json({ status: 'success', data: available });
});

function calculateProgress(achievement: any, user: any): number {
  if (achievement.requiredSessions) {
    return Math.min(100, (user.totalSessionsCompleted / achievement.requiredSessions) * 100);
  }
  if (achievement.requiredStreak) {
    return Math.min(100, (user.streak / achievement.requiredStreak) * 100);
  }
  if (achievement.requiredXP) {
    return Math.min(100, (user.xp / achievement.requiredXP) * 100);
  }
  if (achievement.requiredLevel) {
    return Math.min(100, (user.level / achievement.requiredLevel) * 100);
  }
  return 0;
}

export default router;
