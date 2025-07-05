// EN: Import dotenv and initialize environment variables
import dotenv from 'dotenv';

dotenv.config();

/**
 * EN: Application environment configuration constants
 */
export const ENV_CONFIG = {
  PORT: process.env.PORT || 'your_port_number',
  HOST: process.env.HOST || 'your_host_url', 
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret',
  DATABASE_URL: process.env.DATABASE_URL || 'your_database_url',
  REDIS_URL: process.env.REDIS_URL || 'your_redis_url',
  OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY || 'your_openweather_api_key',
  BASE_URL: process.env.BASE_URL || 'your_base_url',
  LOG_LEVEL: process.env.LOG_LEVEL || 'error', // Default log level
};
