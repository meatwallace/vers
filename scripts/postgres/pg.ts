import postgres from 'postgres';
import { env } from './env.js';

export const pg = postgres(env.POSTGRES_URL);
