// EN: Express request/response/next function types
import { Request, Response, NextFunction } from 'express';

// EN: JSON Web Token for authentication
import jwt from 'jsonwebtoken';

// EN: Custom application messages
import { Messages } from '../constants/messages';

// EN: Enum for user roles
import { Role } from '../constants/roles';

// EN: HTTP status code constants
import { StatusCodes } from '../constants/statusCodes';

// EN: Environment configuration (includes JWT secret)
import { ENV_CONFIG } from '../config/envConfig';

// EN: User payload interface extracted from JWT
import { UserPayload } from '../types/userType';

// EN: Logger instance for centralized logging
import { logger } from '../utils/logger';

// EN: Extend Express request with authenticated user info
export interface AuthRequest extends Request {
  user?: UserPayload;
}

/**
 * EN: Middleware to validate and decode JWT token from the Authorization header
 */
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  // EN: Get Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // EN: If token is missing, return 401 Unauthorized
  if (!token) {
    logger.warn('Authentication failed: Token missing');
    res.status(StatusCodes.UNAUTHORIZED).json({ message: Messages.TOKEN_MISSING });
    return;
  }

  // EN: Verify the JWT token
  jwt.verify(token, ENV_CONFIG.JWT_SECRET, (err, decoded) => {
    if (err) {
      logger.warn(`Authentication failed: Invalid token - ${err.message}`);
      res.status(StatusCodes.FORBIDDEN).json({ message: Messages.INVALID_TOKEN });
      return;
    }

    // EN: Attach decoded user payload to request object
    req.user = decoded as UserPayload;
    logger.info(`Token verified successfully for user ID: ${req.user.userId}`);
    next();
  });
}

/**
 * EN: Middleware to restrict access based on user roles (e.g., ADMIN, USER)
 */
export function authorizeRoles(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // EN: Ensure user is authenticated and has one of the allowed roles
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(
        `Authorization failed: Required roles [${roles.join(', ')}], but received role: ${req.user?.role}`
      );
      res.status(StatusCodes.FORBIDDEN).json({ message: Messages.FORBIDDEN });
      return;
    }

    logger.info(`Authorization successful for user ID: ${req.user.userId}, role: ${req.user.role}`);
    next();
  };
}
