import { addEnvUtils, LoggingSchema, NodeEnvSchema } from '@vers/service-utils';
import { z } from 'zod';

export const envSchema = z
  .object({
    API_IDENTIFIER: z.string(),
    HOSTNAME: z.string(),
    LOGGING: LoggingSchema,
    NODE_ENV: NodeEnvSchema,
    PORT: z.string().transform(Number),
    POSTGRES_URL: z.string(),
  })
  .transform(addEnvUtils);

export const env = envSchema.parse(process.env);
