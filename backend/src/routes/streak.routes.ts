import { Router } from 'express';
import { StreakService } from '../services/streak.service';
import { authenticate } from '../middleware/auth.js';
import { RequestWithUser } from '../types';

const router = Router();

// Daily check-in
router.post('/checkin', authenticate, async (req: RequestWithUser, res) => {
  try {
    const result = await StreakService.checkIn(req.user!.userId);
    res.json(result);
  } catch (error: any) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: error.message || 'Check-in failed' });
  }
});

// Get user's current streak
router.get('/current', authenticate, async (req: RequestWithUser, res) => {
  try {
    const streak = await StreakService.getUserStreak(req.user!.userId);
    res.json(streak);
  } catch (error) {
    console.error('Get streak error:', error);
    res.status(500).json({ error: 'Failed to get streak' });
  }
});

// Get streak history
router.get('/history', authenticate, async (req: RequestWithUser, res) => {
  try {
    const { limit = '10' } = req.query;
    const history = await StreakService.getStreakHistory(
      req.user!.userId,
      parseInt(limit as string)
    );
    res.json(history);
  } catch (error) {
    console.error('Get streak history error:', error);
    res.status(500).json({ error: 'Failed to get streak history' });
  }
});

// Use streak freeze
router.post('/freeze', authenticate, async (req: RequestWithUser, res) => {
  try {
    const result = await StreakService.useStreakFreeze(req.user!.userId);
    res.json(result);
  } catch (error: any) {
    console.error('Streak freeze error:', error);
    res.status(400).json({ error: error.message || 'Failed to use streak freeze' });
  }
});

// Check if needs check-in
router.get('/needs-checkin', authenticate, async (req: RequestWithUser, res) => {
  try {
    const needsCheckIn = await StreakService.needsCheckIn(req.user!.userId);
    res.json({ needsCheckIn });
  } catch (error) {
    console.error('Check needs check-in error:', error);
    res.status(500).json({ error: 'Failed to check' });
  }
});

// Get streak leaderboard
router.get('/leaderboard', authenticate, async (req: RequestWithUser, res) => {
  try {
    const { limit = '100' } = req.query;
    const leaderboard = await StreakService.getStreakLeaderboard(parseInt(limit as string));
    res.json(leaderboard);
  } catch (error) {
    console.error('Get streak leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

export default router;
