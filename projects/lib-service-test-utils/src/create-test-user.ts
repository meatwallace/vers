import * as schema from '@vers/postgres-schema';
import { hashPassword } from '@vers/service-utils';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

interface TestUserConfig {
  db: PostgresJsDatabase<typeof schema>;
  user?: Partial<Omit<typeof schema.users.$inferSelect, 'passwordHash'>> & {
    password?: null | string;
  };
}

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
    createdAt: now,
    email: 'user@test.com',
    id: 'test_id',
    name: 'Test User',
    passwordHash,
    passwordResetToken: null,
    passwordResetTokenExpiresAt: null,
    updatedAt: now,
    username: 'test_user',
    ...rest,
  };

  await config.db.insert(schema.users).values(user);

  return user;
}
