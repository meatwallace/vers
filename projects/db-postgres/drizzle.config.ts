import type { Config } from 'drizzle-kit';

export default {
  dialect: 'postgresql',
  schema: 'projects/lib-postgres-schema/src/index.ts',
  out: 'projects/db-postgres/migrations',
} satisfies Config;
