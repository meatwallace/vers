import type { Config } from 'drizzle-kit';

export default {
  dialect: 'postgresql',
  out: 'projects/db-postgres/migrations',
  schema: 'projects/lib-postgres-schema/src/index.ts',
} satisfies Config;
