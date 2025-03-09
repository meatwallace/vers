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
        target: 'pino-pretty',
        options: {
          ignore: 'pid,hostname,requestID,response',
          colorize: true,
        },
      },
    });
  }

  return pino({
    level: options.level,
  });
}
