import {
  addEnvUtils,
  LoggingSchema,
  NodeEnvSchema,
} from '@chrono/service-utils';
import { z } from 'zod';

export const envSchema = z
  .object({
    LOGGING: LoggingSchema,
    NODE_ENV: NodeEnvSchema,

    POSTGRES_URL: z.string(),
  })
  .transform(addEnvUtils);

export const env = envSchema.parse(process.env);
