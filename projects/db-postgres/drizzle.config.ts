import type { Config } from 'drizzle-kit';

export default {
  schema: '../lib-postgres-schema/src/index.ts',
  out: './migrations',
  driver: 'pg',
} satisfies Config;
