import { addEnvUtils, LoggingSchema, NodeEnvSchema } from '@vers/service-utils';
import { z } from 'zod';

export const envSchema = z
  .object({
    LOGGING: LoggingSchema,
    NODE_ENV: NodeEnvSchema,

    // TEST_USER_EMAIL: z.string(),
    // TEST_USER_PASSWORD: z.string(),
  })
  .transform(addEnvUtils);

export const env = envSchema.parse(process.env);
