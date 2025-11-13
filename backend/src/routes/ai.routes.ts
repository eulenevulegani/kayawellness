import { Router } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth.js';
import { aiService } from '../services/ai.service.js';
import { Response } from 'express';

const router = Router();

router.use(authenticate);

router.post('/session/generate', async (req: AuthRequest, res: Response) => {
  const sessionData = await aiService.generatePersonalizedSession(req.body);
  res.json({ status: 'success', data: sessionData });
});

router.post('/sleep-story/generate', async (req: AuthRequest, res: Response) => {
  const { theme } = req.body;
  const story = await aiService.generateSleepStory(theme);
  res.json({ status: 'success', data: story });
});

router.post('/mood/insights', async (req: AuthRequest, res: Response) => {
  const { moodHistory } = req.body;
  const insights = await aiService.generateMoodInsights(moodHistory);
  res.json({ status: 'success', data: insights });
});

router.post('/chat', async (req: AuthRequest, res: Response) => {
  const { messages } = req.body;
  const response = await aiService.chatWithUser(messages);
  res.json({ status: 'success', data: response });
});

export default router;
