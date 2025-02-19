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

    HOSTNAME: z.string(),
    PORT: z.string().transform(Number),
    POSTGRES_URL: z.string(),
    API_IDENTIFIER: z.string(),
  })
  .transform(addEnvUtils);

export const env = envSchema.parse(process.env);
