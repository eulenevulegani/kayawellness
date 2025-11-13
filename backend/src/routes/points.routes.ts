import { Router } from 'express';
import { PointsService } from '../services/points.service';
import { authenticate } from '../middleware/auth.js';
import { RequestWithUser } from '../types';

const router = Router();

// Get user's points summary
router.get('/summary', authenticate, async (req: RequestWithUser, res) => {
  try {
    const summary = await PointsService.getPointsSummary(req.user!.userId);
    res.json(summary);
  } catch (error) {
    console.error('Get points summary error:', error);
    res.status(500).json({ error: 'Failed to get points summary' });
  }
});

// Get user's transaction history
router.get('/transactions', authenticate, async (req: RequestWithUser, res) => {
  try {
    const { limit = '50', offset = '0' } = req.query;
    const transactions = await PointsService.getTransactionHistory(
      req.user!.userId,
      parseInt(limit as string),
      parseInt(offset as string)
    );
    res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to get transactions' });
  }
});

// Get leaderboard
router.get('/leaderboard', authenticate, async (req: RequestWithUser, res) => {
  try {
    const { limit = '100' } = req.query;
    const leaderboard = await PointsService.getTopUsers(parseInt(limit as string));
    res.json(leaderboard);
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

// Get user's rank
router.get('/rank', authenticate, async (req: RequestWithUser, res) => {
  try {
    const rank = await PointsService.getUserRank(req.user!.userId);
    res.json({ rank });
  } catch (error) {
    console.error('Get rank error:', error);
    res.status(500).json({ error: 'Failed to get rank' });
  }
});

export default router;
