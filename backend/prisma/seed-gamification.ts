import { PrismaClient } from '@prisma/client';
import { ChallengeService } from '../src/services/challenge.service.js';
import { RewardService } from '../src/services/reward.service.js';
import { logger } from '../src/utils/logger.js';

const prisma = new PrismaClient();

async function seedGamification() {
  try {
    logger.info('🎮 Seeding gamification system...');

    // Seed challenges
    logger.info('Creating challenges...');
    const challenges = await ChallengeService.seedChallenges();
    logger.info(`✓ Created ${challenges.length} challenges`);

    // Seed rewards
    logger.info('Creating rewards...');
    const rewards = await RewardService.seedRewards();
    logger.info(`✓ Created ${rewards.length} rewards`);

    // Initialize points for existing users (if any)
    logger.info('Initializing user points...');
    const users = await prisma.user.findMany({
      where: {
        userPoints: null,
      },
    });

    for (const user of users) {
      await prisma.userPoints.create({
        data: {
          userId: user.id,
          totalPoints: 0,
          availablePoints: 0,
          lifetimeEarned: 0,
          lifetimeSpent: 0,
          currentStreak: 0,
          longestStreak: 0,
        },
      });
    }
    logger.info(`✓ Initialized points for ${users.length} users`);

    logger.info('✅ Gamification system seeded successfully!');
  } catch (error) {
    logger.error('❌ Error seeding gamification:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedGamification()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { seedGamification };
