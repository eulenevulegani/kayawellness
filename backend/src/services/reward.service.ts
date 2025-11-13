import { PrismaClient, RewardCategory, RedemptionStatus } from '@prisma/client';
import { PointsService } from './points.service';

const prisma = new PrismaClient();

export interface CreateRewardData {
  title: string;
  description: string;
  category: RewardCategory;
  brand: string;
  pointCost: number;
  stockQuantity?: number;
  imageUrl?: string;
  terms?: string;
  expiryDate?: Date;
  redemptionLimit?: number;
  metadata?: any;
}

export interface RedeemRewardData {
  shippingAddress?: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  notes?: string;
}

export class RewardService {
  /**
   * Create a new reward
   */
  static async createReward(data: CreateRewardData) {
    return await prisma.reward.create({
      data: {
        ...data,
        isActive: true,
        isFeatured: false,
      },
    });
  }

  /**
   * Get all active rewards
   */
  static async getRewards(category?: RewardCategory, featured?: boolean) {
    const where: any = { isActive: true };
    
    if (category) {
      where.category = category;
    }

    if (featured !== undefined) {
      where.isFeatured = featured;
    }

    return await prisma.reward.findMany({
      where,
      include: {
        _count: {
          select: { redemptions: true },
        },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  /**
   * Get reward by ID
   */
  static async getRewardById(rewardId: string) {
    return await prisma.reward.findUnique({
      where: { id: rewardId },
      include: {
        _count: {
          select: { redemptions: true },
        },
      },
    });
  }

  /**
   * Redeem a reward
   */
  static async redeemReward(
    userId: string,
    rewardId: string,
    data: RedeemRewardData
  ) {
    const reward = await this.getRewardById(rewardId);

    if (!reward || !reward.isActive) {
      throw new Error('Reward not found or inactive');
    }

    // Check expiry
    if (reward.expiryDate && reward.expiryDate < new Date()) {
      throw new Error('Reward has expired');
    }

    // Check stock
    if (reward.stockQuantity !== null && reward.stockQuantity <= 0) {
      throw new Error('Reward out of stock');
    }

    // Check user's points
    const userPoints = await prisma.userPoints.findUnique({
      where: { userId },
    });

    if (!userPoints) {
      throw new Error('User points not found');
    }

    if (userPoints.availablePoints < reward.pointCost) {
      throw new Error(`Insufficient points. Need ${reward.pointCost}, have ${userPoints.availablePoints}`);
    }

    // Check redemption limit
    if (reward.redemptionLimit) {
      const userRedemptions = await prisma.redemption.count({
        where: {
          userId,
          rewardId,
        },
      });

      if (userRedemptions >= reward.redemptionLimit) {
        throw new Error(`Redemption limit reached (${reward.redemptionLimit} per user)`);
      }
    }

    // Generate coupon code if needed
    let couponCode: string | undefined;
    if (reward.category === RewardCategory.DISCOUNT_COUPON) {
      couponCode = this.generateCouponCode(reward.brand);
    }

    // Create redemption
    const redemption = await prisma.redemption.create({
      data: {
        userId,
        rewardId,
        userPointsId: userPoints.id,
        pointsSpent: reward.pointCost,
        status: RedemptionStatus.PENDING,
        shippingAddress: data.shippingAddress,
        notes: data.notes,
        couponCode,
      },
      include: {
        reward: true,
      },
    });

    // Deduct points
    await PointsService.spendPoints(userId, reward.pointCost, {
      reason: 'REWARD_REDEMPTION',
      description: `Redeemed: ${reward.title}`,
      metadata: {
        rewardId,
        redemptionId: redemption.id,
        rewardTitle: reward.title,
      },
    });

    // Update stock
    if (reward.stockQuantity !== null) {
      await prisma.reward.update({
        where: { id: rewardId },
        data: {
          stockQuantity: { decrement: 1 },
        },
      });
    }

    return redemption;
  }

  /**
   * Get user's redemption history
   */
  static async getUserRedemptions(userId: string, status?: RedemptionStatus) {
    const where: any = { userId };
    
    if (status) {
      where.status = status;
    }

    return await prisma.redemption.findMany({
      where,
      include: {
        reward: true,
      },
      orderBy: {
        redeemedAt: 'desc',
      },
    });
  }

  /**
   * Update redemption status (admin)
   */
  static async updateRedemptionStatus(
    redemptionId: string,
    status: RedemptionStatus,
    trackingNumber?: string
  ) {
    return await prisma.redemption.update({
      where: { id: redemptionId },
      data: {
        status,
        ...(trackingNumber && { trackingNumber }),
      },
      include: {
        reward: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Cancel redemption (before approval)
   */
  static async cancelRedemption(userId: string, redemptionId: string) {
    const redemption = await prisma.redemption.findUnique({
      where: { id: redemptionId },
      include: { reward: true },
    });

    if (!redemption) {
      throw new Error('Redemption not found');
    }

    if (redemption.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (redemption.status !== RedemptionStatus.PENDING) {
      throw new Error('Can only cancel pending redemptions');
    }

    // Update status
    const updated = await prisma.redemption.update({
      where: { id: redemptionId },
      data: { status: RedemptionStatus.CANCELLED },
    });

    // Refund points
    await PointsService.awardPoints(userId, redemption.pointsSpent, {
      reason: 'REDEMPTION_CANCELLED',
      description: `Refund: ${redemption.reward.title}`,
      metadata: {
        redemptionId,
        originalRewardId: redemption.rewardId,
      },
    });

    // Restore stock
    if (redemption.reward.stockQuantity !== null) {
      await prisma.reward.update({
        where: { id: redemption.rewardId },
        data: {
          stockQuantity: { increment: 1 },
        },
      });
    }

    return updated;
  }

  /**
   * Generate unique coupon code
   */
  private static generateCouponCode(brand: string): string {
    const prefix = brand.substring(0, 3).toUpperCase();
    const randomStr = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `${prefix}-${randomStr}`;
  }

  /**
   * Get featured rewards
   */
  static async getFeaturedRewards(limit: number = 6) {
    return await prisma.reward.findMany({
      where: {
        isActive: true,
        isFeatured: true,
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Search rewards
   */
  static async searchRewards(query: string, category?: RewardCategory) {
    const where: any = {
      isActive: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (category) {
      where.category = category;
    }

    return await prisma.reward.findMany({
      where,
      include: {
        _count: {
          select: { redemptions: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get rewards user can afford
   */
  static async getAffordableRewards(userId: string) {
    const userPoints = await prisma.userPoints.findUnique({
      where: { userId },
    });

    if (!userPoints) {
      return [];
    }

    return await prisma.reward.findMany({
      where: {
        isActive: true,
        pointCost: {
          lte: userPoints.availablePoints,
        },
      },
      orderBy: {
        pointCost: 'asc',
      },
    });
  }

  /**
   * Get popular rewards
   */
  static async getPopularRewards(limit: number = 10) {
    const rewards = await prisma.reward.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { redemptions: true },
        },
      },
    });

    return rewards
      .sort((a, b) => b._count.redemptions - a._count.redemptions)
      .slice(0, limit);
  }

  /**
   * Seed initial rewards (partner collabs)
   */
  static async seedRewards() {
    const rewards = [
      // Wellness Products
      {
        title: 'Meditation Cushion',
        description: 'Premium zafu meditation cushion for comfortable practice',
        category: RewardCategory.WELLNESS_PRODUCT,
        brand: 'ZenSpace',
        pointCost: 5000,
        stockQuantity: 50,
        imageUrl: '/rewards/meditation-cushion.jpg',
        terms: 'Shipping within 7-10 business days',
      },
      {
        title: 'Aromatherapy Essential Oil Set',
        description: 'Set of 6 calming essential oils for relaxation',
        category: RewardCategory.WELLNESS_PRODUCT,
        brand: 'PureEssence',
        pointCost: 3000,
        stockQuantity: 100,
      },
      {
        title: 'Yoga Mat Premium',
        description: 'Eco-friendly, non-slip yoga mat',
        category: RewardCategory.WELLNESS_PRODUCT,
        brand: 'FlowYoga',
        pointCost: 4000,
        stockQuantity: 75,
      },
      
      // Self-Care
      {
        title: 'Luxury Bath Set',
        description: 'Bath salts, candles, and relaxation essentials',
        category: RewardCategory.SELF_CARE,
        brand: 'Serenity Spa',
        pointCost: 2500,
        stockQuantity: 80,
      },
      {
        title: 'Sleep Mask & Earplugs Set',
        description: 'Premium silk sleep mask with memory foam earplugs',
        category: RewardCategory.SELF_CARE,
        brand: 'RestWell',
        pointCost: 1500,
        stockQuantity: 150,
      },
      
      // Experiences
      {
        title: 'Virtual Yoga Class Pass',
        description: '5-class pass for live virtual yoga sessions',
        category: RewardCategory.EXPERIENCE,
        brand: 'YogaFlow Online',
        pointCost: 2000,
        metadata: { sessions: 5 },
      },
      {
        title: 'Guided Meditation Workshop',
        description: '2-hour online meditation workshop with certified instructor',
        category: RewardCategory.EXPERIENCE,
        brand: 'MindfulPath',
        pointCost: 1800,
      },
      
      // Discount Coupons
      {
        title: '20% Off Wellness Store',
        description: '20% discount on all wellness products',
        category: RewardCategory.DISCOUNT_COUPON,
        brand: 'WellnessHub',
        pointCost: 500,
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      },
      {
        title: '$10 Off Next Purchase',
        description: '$10 discount coupon for partner stores',
        category: RewardCategory.DISCOUNT_COUPON,
        brand: 'HealthyLife',
        pointCost: 800,
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      },
      
      // Premium Features
      {
        title: '1 Month Premium Upgrade',
        description: 'Unlock all premium features for 30 days',
        category: RewardCategory.PREMIUM_FEATURE,
        brand: 'KAYA',
        pointCost: 3000,
        isFeatured: true,
      },
      {
        title: 'Ad-Free Experience',
        description: 'Remove ads for 6 months',
        category: RewardCategory.PREMIUM_FEATURE,
        brand: 'KAYA',
        pointCost: 2000,
      },
    ];

    const created = [];
    for (const reward of rewards) {
      const existing = await prisma.reward.findFirst({
        where: { title: reward.title },
      });

      if (!existing) {
        const newReward = await this.createReward(reward as CreateRewardData);
        created.push(newReward);
      }
    }

    return created;
  }

  /**
   * Get redemption statistics
   */
  static async getRedemptionStats(rewardId: string) {
    const total = await prisma.redemption.count({
      where: { rewardId },
    });

    const pending = await prisma.redemption.count({
      where: { rewardId, status: RedemptionStatus.PENDING },
    });

    const approved = await prisma.redemption.count({
      where: { rewardId, status: RedemptionStatus.APPROVED },
    });

    const delivered = await prisma.redemption.count({
      where: { rewardId, status: RedemptionStatus.DELIVERED },
    });

    return {
      total,
      pending,
      approved,
      delivered,
    };
  }
}
