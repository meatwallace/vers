import type { Logger } from 'pino';
import pino from 'pino';

export interface CreateLoggerOptions {
  level: string;
  pretty?: boolean;
  sentryDSN?: string;
}

export function createLogger(options: CreateLoggerOptions): Logger {
  const sentryTransport: pino.TransportTargetOptions = {
    options: {
      dsn: options.sentryDSN,
    },
    target: 'pino-sentry-transport',
  };

  const prettyTransport: pino.TransportTargetOptions = {
    options: {
      colorize: true,
      ignore: 'pid,hostname,requestID,response',
    },
    target: 'pino-pretty',
  };

  const targets: Array<pino.TransportTargetOptions> = [];

  if (options.pretty) {
    targets.push(prettyTransport);
  }

  if (options.sentryDSN) {
    targets.push(sentryTransport);
  }

  const transport: pino.DestinationStream = pino.transport({
    level: options.level,
    targets,
  });

  return pino(transport);
}
