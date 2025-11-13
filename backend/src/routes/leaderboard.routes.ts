import { Router } from 'express';
import { LeaderboardService } from '../services/leaderboard.service';
import { authenticate } from '../middleware/auth.js';
import { RequestWithUser } from '../types';
import { query } from 'express-validator';
import { validate } from '../middleware/validation.js';

const router = Router();

// Get leaderboard by timeframe
router.get(
  '/',
  authenticate,
  query('timeframe').optional().isIn(['DAILY', 'WEEKLY', 'MONTHLY', 'ALL_TIME']),
  query('limit').optional().isInt({ min: 1, max: 500 }),
  validate,
  async (req: RequestWithUser, res) => {
    try {
      const timeframe = (req.query.timeframe as any) || 'ALL_TIME';
      const limit = parseInt(req.query.limit as string) || 100;
      
      const leaderboard = await LeaderboardService.getLeaderboard(timeframe, limit);
      res.json(leaderboard);
    } catch (error) {
      console.error('Get leaderboard error:', error);
      res.status(500).json({ error: 'Failed to get leaderboard' });
    }
  }
);

// Get user's position in leaderboard
router.get(
  '/my-position',
  authenticate,
  query('timeframe').optional().isIn(['DAILY', 'WEEKLY', 'MONTHLY', 'ALL_TIME']),
  validate,
  async (req: RequestWithUser, res) => {
    try {
      const timeframe = (req.query.timeframe as any) || 'ALL_TIME';
      const position = await LeaderboardService.getUserPosition(req.user!.userId, timeframe);
      res.json(position);
    } catch (error) {
      console.error('Get user position error:', error);
      res.status(500).json({ error: 'Failed to get position' });
    }
  }
);

// Get top gainers
router.get(
  '/top-gainers',
  authenticate,
  query('days').optional().isInt({ min: 1, max: 365 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  validate,
  async (req: RequestWithUser, res) => {
    try {
      const days = parseInt(req.query.days as string) || 7;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const topGainers = await LeaderboardService.getTopGainers(days, limit);
      res.json(topGainers);
    } catch (error) {
      console.error('Get top gainers error:', error);
      res.status(500).json({ error: 'Failed to get top gainers' });
    }
  }
);

// Get streak leaderboard
router.get(
  '/streaks',
  authenticate,
  query('limit').optional().isInt({ min: 1, max: 500 }),
  validate,
  async (req: RequestWithUser, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const leaderboard = await LeaderboardService.getStreakLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error('Get streak leaderboard error:', error);
      res.status(500).json({ error: 'Failed to get streak leaderboard' });
    }
  }
);

// Get top earners leaderboard
router.get(
  '/top-earners',
  authenticate,
  query('limit').optional().isInt({ min: 1, max: 500 }),
  validate,
  async (req: RequestWithUser, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const leaderboard = await LeaderboardService.getTopEarnersLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error('Get top earners leaderboard error:', error);
      res.status(500).json({ error: 'Failed to get top earners leaderboard' });
    }
  }
);

// Get challenge completion leaderboard
router.get(
  '/challenges',
  authenticate,
  query('limit').optional().isInt({ min: 1, max: 500 }),
  validate,
  async (req: RequestWithUser, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const leaderboard = await LeaderboardService.getChallengeLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error('Get challenge leaderboard error:', error);
      res.status(500).json({ error: 'Failed to get challenge leaderboard' });
    }
  }
);

// Get global statistics
router.get('/stats/global', authenticate, async (req: RequestWithUser, res) => {
  try {
    const stats = await LeaderboardService.getGlobalStats();
    res.json(stats);
  } catch (error) {
    console.error('Get global stats error:', error);
    res.status(500).json({ error: 'Failed to get global stats' });
  }
});

// Get user's achievements summary
router.get('/stats/my', authenticate, async (req: RequestWithUser, res) => {
  try {
    const summary = await LeaderboardService.getUserAchievementsSummary(req.user!.userId);
    res.json(summary);
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({ error: 'Failed to get user achievements' });
  }
});

export default router;
