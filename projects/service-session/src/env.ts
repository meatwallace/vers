import { addEnvUtils, LoggingSchema, NodeEnvSchema } from '@vers/service-utils';
import { z } from 'zod';

export const envSchema = z
  .object({
    API_IDENTIFIER: z.string(),
    DATABASE_URL: z.string(),
    HOSTNAME: z.string(),
    JWT_SIGNING_PRIVKEY: z
      .string()
      .transform((val) => val.replace(String.raw`\n`, '\n')),
    JWT_SIGNING_PUBKEY: z
      .string()
      .transform((val) => val.replace(String.raw`\n`, '\n')),
    LOGGING: LoggingSchema,
    NODE_ENV: NodeEnvSchema,
    PORT: z.string().transform(Number),
    SENTRY_DSN: z.string().url().optional(),
  })
  .transform(addEnvUtils);

export const env = envSchema.parse(process.env);
