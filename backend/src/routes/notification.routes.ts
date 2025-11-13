import { Router } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth.js';
import prisma from '../config/database.js';
import { Response } from 'express';

const router = Router();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 50
  });
  res.json({ status: 'success', data: notifications });
});

router.patch('/:id/read', async (req: AuthRequest, res: Response) => {
  await prisma.notification.update({
    where: { id: req.params.id },
    data: { isRead: true }
  });
  res.json({ status: 'success', message: 'Marked as read' });
});

router.patch('/read-all', async (req: AuthRequest, res: Response) => {
  await prisma.notification.updateMany({
    where: {
      userId: req.user!.id,
      isRead: false
    },
    data: { isRead: true }
  });
  res.json({ status: 'success', message: 'All marked as read' });
});

export default router;
