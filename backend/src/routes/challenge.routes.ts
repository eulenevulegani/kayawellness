import { Router } from 'express';
import { AuthRequest, authenticate, optionalAuth } from '../middleware/auth.js';
import prisma from '../config/database.js';
import { Response } from 'express';

const router = Router();

router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  const challenges = await prisma.challenge.findMany({
    where: {
      endDate: { gte: new Date() }
    },
    include: {
      _count: {
        select: { participants: true }
      }
    },
    orderBy: { startDate: 'asc' }
  });
  res.json({ status: 'success', data: challenges });
});

router.post('/:id/join', authenticate, async (req: AuthRequest, res: Response) => {
  const participant = await prisma.challengeParticipant.create({
    data: {
      userId: req.user!.id,
      challengeId: req.params.id
    },
    include: { challenge: true }
  });
  res.status(201).json({ status: 'success', data: participant });
});

router.get('/my-challenges', authenticate, async (req: AuthRequest, res: Response) => {
  const challenges = await prisma.challengeParticipant.findMany({
    where: { userId: req.user!.id },
    include: { challenge: true },
    orderBy: { joinedAt: 'desc' }
  });
  res.json({ status: 'success', data: challenges });
});

export default router;
