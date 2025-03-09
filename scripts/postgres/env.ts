import { z } from 'zod';

const envSchema = z.object({
  POSTGRES_URL: z
    .string()
    .default('postgresql://admin:password@localhost:5433/vers'),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
