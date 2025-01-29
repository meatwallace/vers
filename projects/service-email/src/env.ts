import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  LOGGING: z
    .enum(['debug', 'info', 'warn', 'error'])
    .optional()
    .default('info'),

  HOSTNAME: z.string(),
  PORT: z.string().transform(Number),

  API_IDENTIFIER: z.string(),
  RESEND_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
