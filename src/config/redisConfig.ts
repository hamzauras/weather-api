// EN: Redis client configuration and connection setup
import { createClient } from 'redis';
import { ENV_CONFIG } from './envConfig';
import { logger } from '../utils/logger';  // logger import edildi

// EN: Cache expiration time in seconds 
export const REDIS_CONFIG = {
  CACHE_TIME_IN_SEC: 600, // 10 minutes
};

// EN: Create Redis client using the URL from environment variables
export const redisClient = createClient({
  url: ENV_CONFIG.REDIS_URL,
});

// EN: Connect to Redis server and log connection errors if any
redisClient.connect().catch((err) => {
  logger.error(`Redis connection error: ${err.message || err}`);
});
