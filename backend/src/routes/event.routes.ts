import { Router } from 'express';
import { AuthRequest, authenticate, optionalAuth } from '../middleware/auth.js';
import prisma from '../config/database.js';
import { Response } from 'express';

const router = Router();

router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  const { category } = req.query;
  const where: any = { date: { gte: new Date() } };
  
  if (category) {
    where.category = category;
  }

  const events = await prisma.wellnessEvent.findMany({
    where,
    include: {
      _count: {
        select: { registrations: true }
      }
    },
    orderBy: { date: 'asc' }
  });

  res.json({ status: 'success', data: events });
});

router.post('/:id/register', authenticate, async (req: AuthRequest, res: Response) => {
  const registration = await prisma.eventRegistration.create({
    data: {
      userId: req.user!.id,
      eventId: req.params.id
    },
    include: { event: true }
  });
  res.status(201).json({ status: 'success', data: registration });
});

router.get('/my-registrations', authenticate, async (req: AuthRequest, res: Response) => {
  const registrations = await prisma.eventRegistration.findMany({
    where: { userId: req.user!.id },
    include: { event: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ status: 'success', data: registrations });
});

export default router;
