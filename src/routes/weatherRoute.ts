// EN: Express router module
import express from 'express';

// EN: Middleware for authentication and role-based access control
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware';

// EN: Weather-related controller functions
import {
  getMyWeatherQueries,
  getAllWeatherQueries,
  getWeatherByCity,
} from '../controllers/weatherController';

// EN: Role constants used for authorization
import { ROLES } from '../constants/roles';

// EN: Logger for monitoring incoming requests
import { logger } from '../utils/logger';

// EN: Create Express router instance for /api/weather endpoints
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Weather Data Services
 *   description: Endpoints for fetching weather data and query history
 */

/**
 * @swagger
 * /api/weather/my:
 *   get:
 *     summary: Get weather query history for the authenticated user
 *     description: Retrieves the list of weather queries made by the currently logged-in user.
 *     tags: [Weather Data Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's weather query history retrieved successfully
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal server error
 */
// EN: GET /api/weather/my - Returns query history of logged-in user
router.get(
  '/my',
  authenticateToken,
  authorizeRoles(ROLES.ADMIN, ROLES.USER),
  (req, res, next) => {
    logger.info('Incoming GET request to /api/weather/my');
    getMyWeatherQueries(req, res).catch(next);
  }
);

/**
 * @swagger
 * /api/weather/all:
 *   get:
 *     summary: Get weather query history for all users (Admin only)
 *     description: Retrieves the full weather query history across all users. Admin access required.
 *     tags: [Weather Data Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All users' weather queries retrieved successfully
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
// EN: GET /api/weather/all - Returns all user queries (Admin only)
router.get(
  '/all',
  authenticateToken,
  authorizeRoles(ROLES.ADMIN),
  (req, res, next) => {
    logger.info('Incoming GET request to /api/weather/all');
    getAllWeatherQueries(req, res).catch(next);
  }
);

/**
 * @swagger
 * /api/weather/{city}:
 *   get:
 *     summary: Get current weather data for a given city
 *     description: Fetches current weather information from OpenWeather API for a specific city. Also logs the query in user history.
 *     tags: [Weather Data Services]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the city (e.g., London)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weather data retrieved successfully
 *       401:
 *         description: Unauthorized - Token required
 *       500:
 *         description: Failed to fetch weather data
 */
// EN: GET /api/weather/:city - Returns weather data for a specific city
router.get(
  '/:city',
  authenticateToken,
  (req, res, next) => {
    logger.info(`Incoming GET request to /api/weather/${req.params.city}`);
    getWeatherByCity(req, res).catch(next);
  }
);

// EN: Export router for weather-related routes
export default router;
