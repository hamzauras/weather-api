// EN: Import environment configuration
import { ENV_CONFIG } from './config/envConfig';

// EN: Import Express app instanc
import app from './app';

// EN: Import custom logger module for structured logs
import { logger } from './utils/logger';

let server: any;

// EN: Start the server on configured port
export const startServer = () => {
  server = app.listen(ENV_CONFIG.PORT, () => {
    logger.info(`Server started at ${ENV_CONFIG.HOST}:${ENV_CONFIG.PORT}`);
  });
  return server;
};

// EN: Stop the server gracefully
export const stopServer = () => {
  if (server) {
    server.close();
    logger.info('Server stopped');
  }
};