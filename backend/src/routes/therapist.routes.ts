import { Router } from 'express';
import { AuthRequest, optionalAuth } from '../middleware/auth.js';
import prisma from '../config/database.js';
import { Response } from 'express';

const router = Router();

router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  const therapists = await prisma.therapist.findMany({
    where: { isVerified: true },
    orderBy: { rating: 'desc' }
  });
  res.json({ status: 'success', data: therapists });
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const therapist = await prisma.therapist.findUnique({
    where: { id: req.params.id }
  });
  res.json({ status: 'success', data: therapist });
});

export default router;
