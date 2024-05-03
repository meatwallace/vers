import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '@chrononomicon/postgres-schema';

type TestUserConfig = {
  db: PostgresJsDatabase<typeof schema>;
};

type AuthedTestUtils = {
  user: typeof schema.users.$inferSelect;
};

export async function createTestUser(
  config: TestUserConfig,
): Promise<AuthedTestUtils> {
  const user = {
    id: 'test_id',
    auth0ID: 'auth0|test_id',
    email: 'user@test.com',
    emailVerified: true,
    name: 'Test User',
    firstName: 'Test',
    createdAt: new Date(),
  };

  await config.db.insert(schema.users).values(user);

  return { user };
}
