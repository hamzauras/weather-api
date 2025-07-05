// EN: Importing Express and HTTP request-response types
import { Request, Response } from 'express';

// EN: Prisma client for interacting with the database
import prisma from '../../prisma/prismaClient';

// EN: HTTP status code constants
import { StatusCodes } from '../constants/statusCodes';

// EN: Predefined user-related message constants
import { Messages } from '../constants/messages';

// EN: Interface for exposing user information safely
import { UserPublic } from '../types/userType';

// EN: Custom logger for consistent and configurable logging
import { logger } from '../utils/logger';

/**
 * EN: Retrieves all users from the database
 */
export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    // EN: Fetch users with selected fields
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true },
    });

    // EN: Map to public-facing user objects
    const publicUsers: UserPublic[] = users.map(user => ({
      id: user.id,
      email: user.email,
      role: user.role,
    }));

    logger.info('Retrieved all users');

    // EN: Return users as JSON
    res.status(StatusCodes.OK).json(publicUsers);
  } catch (error: unknown) {
    logger.error('Failed to fetch users');
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.FETCH_USERS_ERROR });
  }
}

/**
 * EN: Updates the role of a user by ID
 */
export async function updateUserRole(req: Request, res: Response): Promise<void> {
  const userId = parseInt(req.params.id);
  const { role } = req.body;

  try {
    // EN: Update user role in the database
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    const userPublic: UserPublic = {
      id: updated.id,
      email: updated.email,
      role: updated.role,
    };

    logger.info(`User role updated: ID ${userId}, New Role: ${role}`);

    res.status(StatusCodes.OK).json({ message: Messages.USER_UPDATED, user: userPublic });
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error) {
      const err = error as { code?: string; message?: string };
      if (err.code === StatusCodes.PRISMA_RECORD_NOT_FOUND) {
        logger.warn(`User not found during role update: ID ${userId}`);
        res.status(StatusCodes.NOT_FOUND).json({ message: Messages.USER_NOT_FOUND });
        return;
      }
      logger.error(`User role update error: ${err.message}`);
    } else {
      logger.error('Unknown error during user role update');
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.UPDATE_ERROR });
  }
}

/**
 * EN: Deletes a user by ID
 */
export async function deleteUser(req: Request, res: Response): Promise<void> {
  const userId = parseInt(req.params.id);

  try {
    // EN: Delete user from database
    await prisma.user.delete({ where: { id: userId } });

    logger.info(`User deleted: ID ${userId}`);

    res.status(StatusCodes.OK).json({ message: Messages.USER_DELETED });
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error) {
      const err = error as { code?: string; message?: string };
      if (err.code === StatusCodes.PRISMA_RECORD_NOT_FOUND) {
        logger.warn(`User not found during deletion: ID ${userId}`);
        res.status(StatusCodes.NOT_FOUND).json({ message: Messages.USER_NOT_FOUND });
        return;
      }
      logger.error(`User deletion error: ${err.message}`);
    } else {
      logger.error('Unknown error during user deletion');
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.DELETE_ERROR });
  }
}
