// EN: Express router instance
import express from 'express';

// EN: Middleware for authentication and role-based authorization
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware';

// EN: Controller functions for registration and login
import { handleRegister, handleLogin } from '../controllers/authController';

// EN: Role constants (e.g., ADMIN, USER)
import { ROLES } from '../constants/roles';

// EN: Logger instance for request logging
import { logger } from '../utils/logger';

// EN: Initialize Express router
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Autherization
 *   description: Endpoints for user authentication and registration
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (Admin only)
 *     description: Allows an admin to register a new user with email, password, and role.
 *     tags: [Autherization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123!
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *                 example: USER
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Missing or invalid input data, or email already in use
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Only admins can register new users
 */

// EN: Register endpoint (admin only)
router.post('/register', authenticateToken, authorizeRoles(ROLES.ADMIN), (req, res, next) => {
  logger.info('Incoming POST request to /api/auth/register');
  handleRegister(req, res).catch(next);
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token if credentials are valid.
 *     tags: [Autherization]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123!
 *     responses:
 *       200:
 *         description: Successful login - returns JWT token and user data
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Unauthorized - invalid credentials
 */

// EN: Login endpoint (open to all users)
router.post('/login', (req, res, next) => {
  logger.info('Incoming POST request to /api/auth/login');
  handleLogin(req, res).catch(next);
});

// EN: Export the router for use in app entry point
export default router;
