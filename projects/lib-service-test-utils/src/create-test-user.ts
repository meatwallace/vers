import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@chrono/postgres-schema';
import { hashPassword } from '@chrono/service-utils';

type TestUserConfig = {
  db: PostgresJsDatabase<typeof schema>;
  user?: Partial<Omit<typeof schema.users.$inferSelect, 'passwordHash'>> & {
    password?: string | null;
  };
};

export async function createTestUser(
  config: TestUserConfig,
): Promise<typeof schema.users.$inferSelect> {
  const now = new Date();

  const { password, ...rest } = config.user ?? {};

  let passwordHash = null;

  if (password !== null) {
    passwordHash = await hashPassword(password ?? 'password123');
  }

  const user = {
    id: 'test_id',
    email: 'user@test.com',
    name: 'Test User',
    username: 'test_user',
    passwordHash,
    createdAt: now,
    updatedAt: now,
    ...rest,
  };

  await config.db.insert(schema.users).values(user);

  return user;
}
