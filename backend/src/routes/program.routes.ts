import { Router } from 'express';
import { AuthRequest, authenticate, optionalAuth } from '../middleware/auth.js';
import prisma from '../config/database.js';
import { Response } from 'express';

const router = Router();

router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  const programs = await prisma.wellnessProgram.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ status: 'success', data: programs });
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const program = await prisma.wellnessProgram.findUnique({
    where: { id: req.params.id }
  });
  res.json({ status: 'success', data: program });
});

router.post('/:id/enroll', authenticate, async (req: AuthRequest, res: Response) => {
  const enrollment = await prisma.programEnrollment.create({
    data: {
      userId: req.user!.id,
      programId: req.params.id,
      currentDay: 0
    },
    include: { program: true }
  });
  res.status(201).json({ status: 'success', data: enrollment });
});

router.get('/enrollments/my', authenticate, async (req: AuthRequest, res: Response) => {
  const enrollments = await prisma.programEnrollment.findMany({
    where: { userId: req.user!.id },
    include: { program: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ status: 'success', data: enrollments });
});

router.patch('/enrollments/:id/progress', authenticate, async (req: AuthRequest, res: Response) => {
  const { currentDay } = req.body;
  const enrollment = await prisma.programEnrollment.update({
    where: { id: req.params.id },
    data: { currentDay },
    include: { program: true }
  });
  res.json({ status: 'success', data: enrollment });
});

export default router;
