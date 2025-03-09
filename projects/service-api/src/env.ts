import { addEnvUtils, LoggingSchema, NodeEnvSchema } from '@vers/service-utils';
import { z } from 'zod';

export const envSchema = z
  .object({
    API_IDENTIFIER: z.string(),
    APP_WEB_URL: z.string().url(),

    // service URLs
    EMAILS_SERVICE_URL: z.string().url(),
    HOSTNAME: z.string(),

    JWT_SIGNING_SECRET: z.string(),
    LOGGING: LoggingSchema,

    NODE_ENV: NodeEnvSchema,

    PORT: z.string().transform(Number),
    SESSIONS_SERVICE_URL: z.string().url(),
    USERS_SERVICE_URL: z.string().url(),
    VERIFICATIONS_SERVICE_URL: z.string().url(),
  })
  .transform(addEnvUtils);

export const env = envSchema.parse(process.env);
