import postgres from 'postgres';
import { env } from './env.ts';

export const pg = postgres(env.POSTGRES_URL);
