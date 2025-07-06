// EN: Global setup before any test runs
process.env.NODE_ENV = 'test';
import { startServer } from '../src/server';
import prisma from '../prisma/prismaClient';
import { logger } from '../src/utils/logger';

export default async () => {
  await prisma.user.deleteMany(); // EN: Clean users before tests
  await startServer();
  logger.info('Test environment setup completed');
};

import bcrypt from 'bcryptjs';
import { ROLES } from '../src/constants/roles';

async function main() {
  const email = 'admin@example.com';
  const plainPassword = '123456';

  // EN: Hash the plain password before saving
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // EN: Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingAdmin) {
    // EN: Create new admin user
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: ROLES.ADMIN,
      },
    });
    logger.info(`${ROLES.ADMIN} user created: ${email}`);
  } else {
    logger.info(`${ROLES.ADMIN} user already exists: ${email}`);
  }
}

main()
  .then(() => {
    logger.info('Seeding completed.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    logger.error('Seeding failed:', e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });




