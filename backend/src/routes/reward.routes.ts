import { Router } from 'express';
import { RewardService } from '../services/reward.service';
import { authenticate } from '../middleware/auth.js';
import { RequestWithUser } from '../types';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validation.js';

const router = Router();

// Get all rewards
router.get(
  '/',
  authenticate,
  query('category').optional().isString(),
  query('featured').optional().isBoolean(),
  validate,
  async (req: RequestWithUser, res) => {
    try {
      const { category, featured } = req.query;
      const rewards = await RewardService.getRewards(
        category as any,
        featured === 'true'
      );
      res.json(rewards);
    } catch (error) {
      console.error('Get rewards error:', error);
      res.status(500).json({ error: 'Failed to get rewards' });
    }
  }
);

// Get featured rewards
router.get('/featured', authenticate, async (req: RequestWithUser, res) => {
  try {
    const { limit = '6' } = req.query;
    const rewards = await RewardService.getFeaturedRewards(parseInt(limit as string));
    res.json(rewards);
  } catch (error) {
    console.error('Get featured rewards error:', error);
    res.status(500).json({ error: 'Failed to get featured rewards' });
  }
});

// Get affordable rewards
router.get('/affordable', authenticate, async (req: RequestWithUser, res) => {
  try {
    const rewards = await RewardService.getAffordableRewards(req.user!.userId);
    res.json(rewards);
  } catch (error) {
    console.error('Get affordable rewards error:', error);
    res.status(500).json({ error: 'Failed to get affordable rewards' });
  }
});

// Get popular rewards
router.get('/popular', authenticate, async (req: RequestWithUser, res) => {
  try {
    const { limit = '10' } = req.query;
    const rewards = await RewardService.getPopularRewards(parseInt(limit as string));
    res.json(rewards);
  } catch (error) {
    console.error('Get popular rewards error:', error);
    res.status(500).json({ error: 'Failed to get popular rewards' });
  }
});

// Search rewards
router.get(
  '/search',
  authenticate,
  query('q').isString().notEmpty(),
  query('category').optional().isString(),
  validate,
  async (req: RequestWithUser, res) => {
    try {
      const { q, category } = req.query;
      const rewards = await RewardService.searchRewards(q as string, category as any);
      res.json(rewards);
    } catch (error) {
      console.error('Search rewards error:', error);
      res.status(500).json({ error: 'Failed to search rewards' });
    }
  }
);

// Get reward by ID
router.get(
  '/:rewardId',
  authenticate,
  param('rewardId').isUUID(),
  validate,
  async (req: RequestWithUser, res) => {
    try {
      const reward = await RewardService.getRewardById(req.params.rewardId);
      if (!reward) {
        return res.status(404).json({ error: 'Reward not found' });
      }
      res.json(reward);
    } catch (error) {
      console.error('Get reward error:', error);
      res.status(500).json({ error: 'Failed to get reward' });
    }
  }
);

// Redeem a reward
router.post(
  '/:rewardId/redeem',
  authenticate,
  param('rewardId').isUUID(),
  body('shippingAddress').optional().isObject(),
  body('notes').optional().isString(),
  validate,
  async (req: RequestWithUser, res) => {
    try {
      const { shippingAddress, notes } = req.body;
      const redemption = await RewardService.redeemReward(
        req.user!.userId,
        req.params.rewardId,
        { shippingAddress, notes }
      );
      res.json(redemption);
    } catch (error: any) {
      console.error('Redeem reward error:', error);
      res.status(400).json({ error: error.message || 'Failed to redeem reward' });
    }
  }
);

// Get user's redemptions
router.get(
  '/redemptions/my',
  authenticate,
  query('status').optional().isString(),
  validate,
  async (req: RequestWithUser, res) => {
    try {
      const { status } = req.query;
      const redemptions = await RewardService.getUserRedemptions(
        req.user!.userId,
        status as any
      );
      res.json(redemptions);
    } catch (error) {
      console.error('Get redemptions error:', error);
      res.status(500).json({ error: 'Failed to get redemptions' });
    }
  }
);

// Cancel redemption
router.post(
  '/redemptions/:redemptionId/cancel',
  authenticate,
  param('redemptionId').isUUID(),
  validate,
  async (req: RequestWithUser, res) => {
    try {
      const redemption = await RewardService.cancelRedemption(
        req.user!.userId,
        req.params.redemptionId
      );
      res.json(redemption);
    } catch (error: any) {
      console.error('Cancel redemption error:', error);
      res.status(400).json({ error: error.message || 'Failed to cancel redemption' });
    }
  }
);

// Get reward stats (admin)
router.get(
  '/:rewardId/stats',
  authenticate,
  param('rewardId').isUUID(),
  validate,
  async (req: RequestWithUser, res) => {
    try {
      const stats = await RewardService.getRedemptionStats(req.params.rewardId);
      res.json(stats);
    } catch (error) {
      console.error('Get reward stats error:', error);
      res.status(500).json({ error: 'Failed to get stats' });
    }
  }
);

export default router;
