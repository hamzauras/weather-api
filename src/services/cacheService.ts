// EN: Redis client instance configured from application settings
import { redisClient } from '../config/redisConfig';

// EN: Logger utility for capturing structured logs
import { logger } from '../utils/logger';

/**
 * EN: Retrieves cached data for a given key from Redis
 * @param key Cache key string
 * @returns Cached value as string or null if not found or on error
 */
export async function getCache(key: string): Promise<string | null> {
  try {
    const value = await redisClient.get(key);

    if (value) {
      logger.debug(`Cache hit for key: ${key}`);
    } else {
      logger.debug(`Cache miss for key: ${key}`);
    }

    return value;
  } catch (error) {
    logger.error(`Redis GET error for key "${key}": ${(error as Error).message}`);
    return null;
  }
}

/**
 * EN: Stores a value in Redis cache with expiration
 * @param key Cache key
 * @param value Value to store as string
 * @param ttlSeconds Expiration time in seconds
 */
export async function setCache(key: string, value: string, ttlSeconds: number): Promise<void> {
  try {
    await redisClient.set(key, value, { EX: ttlSeconds });
    logger.debug(`Cache set for key: ${key} (TTL: ${ttlSeconds}s)`);
  } catch (error) {
    logger.error(`Redis SET error for key "${key}": ${(error as Error).message}`);
  }
}
