import { Router } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth.js';
import prisma from '../config/database.js';
import { Response } from 'express';

const router = Router();

router.use(authenticate);

router.post('/', async (req: AuthRequest, res: Response) => {
  const entry = await prisma.journalEntry.create({
    data: {
      userId: req.user!.id,
      ...req.body
    }
  });
  res.status(201).json({ status: 'success', data: entry });
});

router.get('/', async (req: AuthRequest, res: Response) => {
  const entries = await prisma.journalEntry.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  res.json({ status: 'success', data: entries });
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const entry = await prisma.journalEntry.findFirst({
    where: {
      id: req.params.id,
      userId: req.user!.id
    }
  });
  res.json({ status: 'success', data: entry });
});

router.patch('/:id', async (req: AuthRequest, res: Response) => {
  const entry = await prisma.journalEntry.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json({ status: 'success', data: entry });
});

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  await prisma.journalEntry.delete({
    where: { id: req.params.id }
  });
  res.json({ status: 'success', message: 'Entry deleted' });
});

router.post('/gratitude', async (req: AuthRequest, res: Response) => {
  const entry = await prisma.gratitudeEntry.create({
    data: {
      userId: req.user!.id,
      word: req.body.word
    }
  });
  res.status(201).json({ status: 'success', data: entry });
});

router.get('/gratitude/list', async (req: AuthRequest, res: Response) => {
  const entries = await prisma.gratitudeEntry.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 100
  });
  res.json({ status: 'success', data: entries });
});

router.post('/mood', async (req: AuthRequest, res: Response) => {
  const entry = await prisma.moodEntry.create({
    data: {
      userId: req.user!.id,
      ...req.body
    }
  });
  res.status(201).json({ status: 'success', data: entry });
});

router.get('/mood/history', async (req: AuthRequest, res: Response) => {
  const days = parseInt(req.query.days as string) || 30;
  const entries = await prisma.moodEntry.findMany({
    where: {
      userId: req.user!.id,
      createdAt: {
        gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  res.json({ status: 'success', data: entries });
});

export default router;
