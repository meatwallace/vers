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

    API_IDENTIFIER: z.string(),
    RESEND_API_KEY: z.string(),
  })
  .transform(addEnvUtils);

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
