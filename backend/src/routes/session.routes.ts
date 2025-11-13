import { Router } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth.js';
import { sessionService } from '../services/session.service.js';
import { Response } from 'express';

const router = Router();

router.use(authenticate);

router.post('/', async (req: AuthRequest, res: Response) => {
  const session = await sessionService.createSession(req.user!.id, req.body);
  res.status(201).json({ status: 'success', data: session });
});

router.get('/', async (req: AuthRequest, res: Response) => {
  const { limit, offset } = req.query;
  const sessions = await sessionService.getUserSessions(
    req.user!.id,
    limit ? parseInt(limit as string) : 20,
    offset ? parseInt(offset as string) : 0
  );
  res.json({ status: 'success', data: sessions });
});

router.get('/stats', async (req: AuthRequest, res: Response) => {
  const stats = await sessionService.getSessionStats(req.user!.id);
  res.json({ status: 'success', data: stats });
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const session = await sessionService.getSession(req.params.id, req.user!.id);
  res.json({ status: 'success', data: session });
});

router.patch('/:id/complete', async (req: AuthRequest, res: Response) => {
  const session = await sessionService.completeSession(
    req.params.id,
    req.user!.id,
    req.body
  );
  
  // Award points for session completion (handled in hook)
  res.json({ status: 'success', data: session });
});

export default router;
