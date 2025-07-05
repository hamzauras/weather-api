// EN: Load environment variables from config
import { ENV_CONFIG } from '../config/envConfig';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// EN: Determine if we are in test environment
const isTestEnv = process.env.NODE_ENV === 'test';

// EN: Define log directory and file path based on environment
const logDirectory = path.join(__dirname, '../../logs');
const fileName = isTestEnv ? 'test.log' : 'application-%DATE%.log';

// EN: Configure log format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, message, stack }) => {
    return `[${timestamp}] [${level.toUpperCase()}]: ${stack || message}`;
  })
);

// EN: File transport for writing logs to disk (rotates daily unless in test)
const fileTransport = isTestEnv
  ? new transports.File({
      filename: path.join(logDirectory, fileName),
      level: 'silly', // capture all levels
    })
  : new DailyRotateFile({
      filename: path.join(logDirectory, fileName),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'silly',
    });

// EN: Console transport (disabled in test mode)
const consoleTransport = !isTestEnv
  ? new transports.Console({
      level: ENV_CONFIG.LOG_LEVEL || 'info',
      format: format.combine(format.colorize(), format.simple()),
    })
  : null;

/*
  Winston Log Levels (from most to least important):

  error   - Critical failures
  warn    - Warning situations
  info    - General operational messages
  http    - HTTP-specific logs (optional)
  verbose - Detailed status updates
  debug   - Debugging info for devs
  silly   - Deeply verbose logs

  All logs are written to file.
  Console logs are disabled during tests (NODE_ENV=test).
*/

export const logger = createLogger({
  format: logFormat,
  transports: [
    fileTransport,
    ...(consoleTransport ? [consoleTransport] : []),
  ],
});
