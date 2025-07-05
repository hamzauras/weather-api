// EN: Role type imported from Prisma schema for consistency across the app
import { Role as PrismaRole } from '@prisma/client';

// EN: Alias for Prisma's Role type
export type Role = PrismaRole;

// EN: Application role constants to avoid magic strings and enable type safety
export const ROLES = {
  ADMIN: 'ADMIN' as Role,
  USER: 'USER' as Role,
};
