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
    JWT_SIGNING_SECRET: z.string(),

    APP_WEB_URL: z.string().url(),

    // service URLs
    EMAILS_SERVICE_URL: z.string().url(),
    SESSIONS_SERVICE_URL: z.string().url(),
    USERS_SERVICE_URL: z.string().url(),
    VERIFICATIONS_SERVICE_URL: z.string().url(),
    WORLDS_SERVICE_URL: z.string().url(),
  })
  .transform(addEnvUtils);

export const env = envSchema.parse(process.env);
