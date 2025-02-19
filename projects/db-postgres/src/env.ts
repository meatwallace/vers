import { z } from 'zod';
import {
  addEnvUtils,
  NodeEnvSchema,
  LoggingSchema,
} from '@chrono/service-utils';

export const envSchema = z
  .object({
    NODE_ENV: NodeEnvSchema,
    LOGGING: LoggingSchema,

    POSTGRES_URL: z.string(),
  })
  .transform(addEnvUtils);

export const env = envSchema.parse(process.env);
