// EN: Import PrismaClient for database access and instantiate it
import { PrismaClient } from '@prisma/client';

// EN: Create a single Prisma client instance to be shared across the app
const prisma = new PrismaClient();

// EN: Export the Prisma client instance for use in services and controllers
export default prisma;
