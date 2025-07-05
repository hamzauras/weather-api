// EN: Import environment configuration
import { ENV_CONFIG } from './config/envConfig';

// EN: Import Express app instance
import app from './app';

// EN: Import custom logger module for structured logs
import { logger } from './utils/logger';

// EN: Start the server on configured port
app.listen(ENV_CONFIG.PORT, () => {
  // EN: Log server start event
  logger.info(`Server started and running at ${ENV_CONFIG.HOST}${ENV_CONFIG.PORT}`);
});
