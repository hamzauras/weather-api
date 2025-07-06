// EN: Importing Express and HTTP request-response types
import { Request, Response } from 'express';

// EN: Auth service functions for registration and login
import { registerUser, loginUser } from '../services/authService';

// EN: HTTP status code constants
import { StatusCodes } from '../constants/statusCodes';

// EN: Constant message definitions
import { Messages } from '../constants/messages';

// EN: Interface for the public version of user returned to frontend
import { UserPublic } from '../types/userType';

// EN: Custom logger module for consistent logging
import { logger } from '../utils/logger';

/**
 * EN: Handles new user registration. Should be used only by users with admin privileges.
 */
export async function handleRegister(req: Request, res: Response): Promise<void> {
  try {
    // EN: Extract email, password, and role from request body
    const { email, password, role } = req.body;

    // EN: Check for missing required fields
    if (!email || !password || !role) {
      logger.warn('Registration failed: Missing fields'); // EN: Logging missing fields
      res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.MISSING_FIELDS });
      return;
    }

    // EN: Register the user in the database
    const user = await registerUser(email, password, role);

    // EN: Convert user object to a safe public version
    const userPublic: UserPublic = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // EN: Log successful registration
    logger.info(`User registered: ${email} (Role: ${role})`);

    // EN: Send success response
    res.status(StatusCodes.CREATED).json({
      message: Messages.USER_REGISTERED,
      user: userPublic,
    });
  } catch (error: unknown) {
    // EN: Known error handling
    if (error instanceof Error) {
      if (error.message!== null) {
        logger.warn(`Registration failed: Email already in use (${req.body.email})`);
        res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.EMAIL_IN_USE });
        return;
      }
    } else {
      // EN: Log unknown error
      logger.error('Unknown registration error');
    }
    // EN: Return internal server error response
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
  }
}

/**
 * EN: Handles user login operation
 */
export async function handleLogin(req: Request, res: Response): Promise<void> {
  try {
    // EN: Extract email and password from request body
    const { email, password } = req.body;

    // EN: Check for missing required fields
    if (!email || !password) {
      logger.warn('Login failed: Missing fields');
      res.status(StatusCodes.BAD_REQUEST).json({ message: Messages.MISSING_FIELDS });
      return;
    }

    // EN: Authenticate the user and generate token
    const { token, user } = await loginUser(email, password);

    // EN: Format user object for frontend
    const userPublic: UserPublic = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    logger.info(`Login successful: ${email}`);

    // EN: Send response with token and user
    res.json({ token, user: userPublic });
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.warn(`Login failed for email ${req.body.email}: ${error.message}`);
      res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
      return;
    }

    logger.error('Unknown login error');
    res.status(StatusCodes.UNAUTHORIZED).json({ message: Messages.INVALID_CREDENTIALS });
  }
}
