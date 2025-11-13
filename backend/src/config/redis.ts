import Redis from 'ioredis';
import { config } from './index.js';
import { logger } from '../utils/logger.js';

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3
});

redis.on('connect', () => {
  logger.info('Redis connection established');
});

redis.on('error', (error) => {
  // Silently log Redis errors to avoid spamming console
  if (error.code !== 'ECONNREFUSED') {
    logger.error('Redis connection error:', error);
  }
});

redis.on('ready', () => {
  logger.info('Redis is ready');
});

export const connectRedis = async () => {
  try {
    await redis.ping();
    logger.info('✅ Redis connected successfully');
  } catch (error) {
    logger.error('⚠️ Failed to connect to Redis:', error);
    logger.warn('⚠️ Server will start without Redis caching');
    // Don't throw - allow server to start without Redis
  }
};

// Cache utilities
export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  },

  async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    try {
      await redis.setex(key, ttlSeconds, JSON.stringify(value));
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
    }
  },

  async delPattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      logger.error(`Cache delete pattern error for ${pattern}:`, error);
    }
  }
};

export default redis;
