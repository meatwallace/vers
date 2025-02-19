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

    // TEST_USER_EMAIL: z.string(),
    // TEST_USER_PASSWORD: z.string(),
  })
  .transform(addEnvUtils);

export const env = envSchema.parse(process.env);
