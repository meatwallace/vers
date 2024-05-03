import type { Config } from 'drizzle-kit';

export default {
  dialect: 'postgresql',
  schema: '../lib-postgres-schema/src/index.ts',
  out: './migrations',
} satisfies Config;
