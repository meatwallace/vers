import * as schema from '@vers/postgres-schema';
import { hashPassword } from '@vers/service-utils';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

type TestUserData = Partial<
  Omit<typeof schema.users.$inferSelect, 'passwordHash'> & {
    password?: null | string;
  }
>;

export async function createTestUser(
  db: PostgresJsDatabase<typeof schema>,
  data: TestUserData = {},
): Promise<typeof schema.users.$inferSelect> {
  const now = new Date();

  let passwordHash = null;

  if (data.password !== null) {
    passwordHash = await hashPassword(data.password ?? 'password123');
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
    ...data,
  } satisfies typeof schema.users.$inferInsert;

  await db.insert(schema.users).values(user);

  return user;
}
