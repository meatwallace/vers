import { addEnvUtils, LoggingSchema, NodeEnvSchema } from '@vers/service-utils';
import { z } from 'zod';

export const envSchema = z
  .object({
    LOGGING: LoggingSchema,
    NODE_ENV: NodeEnvSchema,
    SENTRY_DSN: z.string().url().optional(),
  })
  .transform(addEnvUtils);

export const env = envSchema.parse(process.env);
