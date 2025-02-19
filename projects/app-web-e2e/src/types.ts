import { z } from 'zod';
import { envSchema } from './env';

export type Env = z.infer<typeof envSchema>;
