// EN: Express framework import
import express from 'express';

// EN: Middleware for authenticating users and authorizing specific roles
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware';

// EN: Controller functions for user operations (GET, PUT, DELETE)
import { getAllUsers, updateUserRole, deleteUser } from '../controllers/userController';

// EN: Predefined user role constants (e.g., ADMIN, USER)
import { ROLES } from '../constants/roles';

// EN: Winston logger for tracking incoming route requests
import { logger } from '../utils/logger';

// EN: Create an Express router instance for /api/users
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: User Management
 *   description: Admin-only endpoints for managing users
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve a list of all registered users
 *     description: Accessible only by admin users. Returns all users in the system with basic info.
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users successfully retrieved
 *       403:
 *         description: Forbidden - Admin access required
 */
// EN: GET /api/users - Admin-only: Retrieve all users
router.get('/', authenticateToken, authorizeRoles(ROLES.ADMIN), (req, res, next) => {
  logger.info('Incoming GET request to /api/users');
  getAllUsers(req, res).catch(next);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user's role
 *     description: Allows an admin to update the role of a specific user by ID.
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to update
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *     responses:
 *       200:
 *         description: User role successfully updated
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden - Admin access required
 */
// EN: PUT /api/users/:id - Admin-only: Update user role
router.put('/:id', authenticateToken, authorizeRoles(ROLES.ADMIN), (req, res, next) => {
  logger.info(`Incoming PUT request to /api/users/${req.params.id}`);
  updateUserRole(req, res).catch(next);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Deletes a user account by ID. Only accessible by admins.
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to delete
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User successfully deleted
 *       404:
 *         description: User not found
 *       403:
 *         description: Forbidden - Admin access required
 */
// EN: DELETE /api/users/:id - Admin-only: Delete user by ID
router.delete('/:id', authenticateToken, authorizeRoles(ROLES.ADMIN), (req, res, next) => {
  logger.info(`Incoming DELETE request to /api/users/${req.params.id}`);
  deleteUser(req, res).catch(next);
});

// EN: Export the configured router
export default router;
