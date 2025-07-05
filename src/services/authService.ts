// EN: Prisma client for database access
import prisma from '../../prisma/prismaClient';

// EN: Password hashing and verification utility
import bcrypt from 'bcryptjs';

// EN: JWT library for token generation
import jwt from 'jsonwebtoken';

// EN: Environment configuration (e.g., secret keys)
import { ENV_CONFIG } from '../config/envConfig';

// EN: User role enum
import { Role } from '../constants/roles';

// EN: Application-wide message constants
import { Messages } from '../constants/messages';

// EN: Interfaces for authenticated user payload and safe public user
import { UserPayload, UserPublic } from '../types/userType';

// EN: Logger utility for structured logging
import { logger } from '../utils/logger';

/**
 * EN: Registers a new user with a hashed password and saves to database
 * @param email User's email
 * @param password Plaintext password
 * @param role User's role (ADMIN/USER)
 * @returns Public version of created user
 */
export async function registerUser(email: string, password: string, role: Role): Promise<UserPublic> {
  // EN: Hash the user's password securely
  const hashedPassword = await bcrypt.hash(password, 10);

  // EN: Create the user in the database
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, role },
  });

  logger.info(`New user registered with email: ${email}, role: ${role}`);

  // EN: Return non-sensitive public user data
  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

/**
 * EN: Authenticates a user by verifying email and password, and returns a signed JWT
 * @param email User's email
 * @param password User's password
 * @returns JWT token and public user information
 * @throws Error if user not found or password is invalid
 */
export async function loginUser(email: string, password: string): Promise<{ token: string; user: UserPublic }> {
  const user = await prisma.user.findUnique({ where: { email } });

  // EN: Handle case where user does not exist
  if (!user) {
    logger.warn(`Login failed: user not found (${email})`);
    throw new Error(Messages.USER_NOT_FOUND);
  }

  // EN: Compare plaintext password with hashed password
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    logger.warn(`Login failed: invalid credentials (${email})`);
    throw new Error(Messages.INVALID_CREDENTIALS);
  }

  // EN: Create JWT payload and sign the token
  const payload: UserPayload = {
    userId: user.id,
    role: user.role,
  };

  const token = jwt.sign(payload, ENV_CONFIG.JWT_SECRET, { expiresIn: '1h' });

  logger.info(`User login successful: ${email}`);

  // EN: Return token and public user data
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}
