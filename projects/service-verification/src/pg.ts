import postgres from 'postgres';
import { env } from './env';

export const pg = postgres(env.POSTGRES_URL);
