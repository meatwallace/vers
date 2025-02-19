import { z } from 'zod';
import { envSchema } from './env';

export type HandlerContext = Record<string, never>;

export type Env = z.infer<typeof envSchema>;
