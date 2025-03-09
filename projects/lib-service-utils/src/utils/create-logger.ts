import type { Logger } from 'pino';
import pino from 'pino';

export interface CreateLoggerOptions {
  level: string;
  pretty?: boolean;
}

export function createLogger(options: CreateLoggerOptions): Logger {
  if (options.pretty) {
    return pino({
      level: options.level,
      transport: {
        options: {
          colorize: true,
          ignore: 'pid,hostname,requestID,response',
        },
        target: 'pino-pretty',
      },
    });
  }

  return pino({
    level: options.level,
  });
}
