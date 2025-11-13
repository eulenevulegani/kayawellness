import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ],
});

// Log queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query' as never, (e: any) => {
    logger.debug('Query: ' + e.query);
    logger.debug('Duration: ' + e.duration + 'ms');
  });
}

prisma.$on('error' as never, (e: any) => {
  logger.error('Prisma Error:', e);
});

prisma.$on('warn' as never, (e: any) => {
  logger.warn('Prisma Warning:', e);
});

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connection established');
  } catch (error) {
    logger.error('⚠️ Failed to connect to database:', error);
    logger.warn('⚠️ Server will start without database connection');
    // Don't throw - allow server to start without database
  }
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
  logger.info('Database connection closed');
};

export default prisma;
