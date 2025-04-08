import { addEnvUtils, LoggingSchema, NodeEnvSchema } from '@vers/service-utils';
import { z } from 'zod';

export const envSchema = z
  .object({
    HOSTNAME: z.string().optional().default('localhost'),
    LOGGING: LoggingSchema,
    NODE_ENV: NodeEnvSchema,
    PORT: z.string().optional().default('5500').transform(Number),
  })
  .transform(addEnvUtils);

export const env = envSchema.parse(process.env);
