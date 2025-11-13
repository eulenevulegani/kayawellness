import { Router } from 'express';
import { AuthRequest, authenticate, optionalAuth } from '../middleware/auth.js';
import prisma from '../config/database.js';
import { Response } from 'express';

const router = Router();

router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const challenges = await prisma.challenge.findMany({
      where: { endDate: { gte: new Date() } },
      include: { _count: { select: { participants: true } } },
      orderBy: { startDate: 'asc' }
    });
    res.json({ status: 'success', data: challenges });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch challenges' });
  }
});

router.post('/:id/join', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const participant = await prisma.challengeParticipant.create({
      data: { userId: req.user!.id, challengeId: req.params.id },
      include: { challenge: true }
    });
    res.status(201).json({ status: 'success', data: participant });
  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to join challenge' });
  }
});

router.get('/my-challenges', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const challenges = await prisma.challengeParticipant.findMany({
      where: { userId: req.user!.id },
      include: { challenge: true },
      orderBy: { joinedAt: 'desc' }
    });
    res.json({ status: 'success', data: challenges });
  } catch (error) {
    console.error('Get user challenges error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch challenges' });
  }
});

export default router;
