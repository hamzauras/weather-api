// EN: Express response type
import { Response } from 'express';

// EN: Authenticated request with user info
import { AuthRequest } from '../middlewares/authMiddleware';

// EN: External weather API service
import { fetchWeather } from '../services/weatherService';

// EN: Redis cache operations
import { getCache, setCache } from '../services/cacheService';

// EN: Prisma client for database access
import prisma from '../../prisma/prismaClient';

// EN: Message constants
import { Messages } from '../constants/messages';

// EN: HTTP status codes
import { StatusCodes } from '../constants/statusCodes';

// EN: Redis configuration for cache TTL
import { REDIS_CONFIG } from '../config/redisConfig';

// EN: Logger module for structured log output
import { logger } from '../utils/logger';

/**
 * EN: Retrieves weather queries made by the authenticated user
 */
export async function getMyWeatherQueries(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.userId;

  // EN: Check if user is authenticated
  if (!userId) {
    logger.warn('Unauthorized weather query request');
    res.status(StatusCodes.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
    return;
  }

  try {
    const queries = await prisma.weatherQuery.findMany({
      where: { userId },
      orderBy: { queriedAt: 'desc' },
    });

    logger.info(`Weather queries retrieved for user ID: ${userId}`);

    res.status(StatusCodes.OK).json(queries);
  } catch (error) {
    logger.error(`Failed to fetch weather queries for user ID: ${userId}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.WEATHER_FETCH_ERROR });
  }
}

/**
 * EN: Retrieves all weather queries from all users (admin use)
 */
export async function getAllWeatherQueries(req: AuthRequest, res: Response): Promise<void> {
  try {
    const queries = await prisma.weatherQuery.findMany({
      include: { user: true },
      orderBy: { queriedAt: 'desc' },
    });

    logger.info('All weather queries retrieved by admin');

    res.status(StatusCodes.OK).json(queries);
  } catch (error) {
    logger.error('Failed to fetch all weather queries');
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.WEATHER_FETCH_ERROR });
  }
}

/**
 * EN: Fetches weather data for a specific city, using cache and saving the query
 */
export async function getWeatherByCity(req: AuthRequest, res: Response): Promise<void> {
  const city = req.params.city;
  const userId = req.user?.userId;

  if (!userId) {
    logger.warn('Unauthorized weather data request');
    res.status(StatusCodes.UNAUTHORIZED).json({ message: Messages.UNAUTHORIZED });
    return;
  }

  const cacheKey = `weather:${city.toLowerCase()}`;

  try {
    const cachedData = await getCache(cacheKey);
    let weatherData;

    // EN: Serve from cache if available
    if (cachedData) {
      logger.info(`Cache hit for city: ${city}`);
      weatherData = JSON.parse(cachedData);
    } else {
      // EN: Fetch from external API
      weatherData = await fetchWeather(city);

      logger.info(`Fetched fresh weather data for city: ${city}`);

      // EN: Save to cache for next requests
      await setCache(cacheKey, JSON.stringify(weatherData), REDIS_CONFIG.CACHE_TIME_IN_SEC);
    }

    // EN: Save user query to database
    await prisma.weatherQuery.create({
      data: {
        city,
        result: JSON.stringify(weatherData),
        userId,
      },
    });

    logger.info(`Weather query saved for user ID ${userId}, city: ${city}`);

    res.status(StatusCodes.OK).json(weatherData);
  } catch (error) {
    logger.error(`Error occurred while fetching weather for city: ${city}`);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.WEATHER_FETCH_ERROR });
  }
}
