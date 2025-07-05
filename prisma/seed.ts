import prisma from './prismaClient';
import bcrypt from 'bcryptjs';
import { ROLES } from '../src/constants/roles';
import { logger } from '../src/utils/logger';  // EN: Logger for structured logging

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
