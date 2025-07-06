// EN: Global teardown after all tests complete
// EN: Import server control functions
import { stopServer } from '../src/server';

// EN: Import database clients
import prisma from '../prisma/prismaClient';
import { redisClient } from '../src/config/redisConfig';

// EN: Import logger utility
import { logger } from '../src/utils/logger';

// EN: Default teardown function that runs after all tests complete
export default async () => {
  // EN: Log cleanup process start
  logger.info('>>> Starting test cleanup process...');

  try {
    // EN: Stop the test server instance
    stopServer();
    
    // EN: Close Redis connection if open
    if (redisClient.isOpen) {
      await redisClient.quit();
      logger.info('Redis connection closed successfully.');
    }

    // EN: Disconnect Prisma client
    await prisma.user.deleteMany();
    await prisma.$disconnect();
    logger.info('Prisma connection closed successfully.');

    // EN: Log successful completion
    logger.info('>>> Test cleanup completed successfully.');
  } catch (err) {
    // EN: Log any errors during cleanup
    logger.error('Error during test cleanup:', err);
  }
};