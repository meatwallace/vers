import { expect, test } from 'vitest';
import * as schema from '@vers/postgres-schema';
import { createTestDB, createTestUser } from '@vers/service-test-utils';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { router } from '../router';
import { t } from '../t';

const createCaller = t.createCallerFactory(router);

interface TestConfig {
  db: PostgresJsDatabase<typeof schema>;
}

async function setupTest(config: TestConfig) {
  const caller = createCaller({ db: config.db });
  const user = await createTestUser(config.db);

  return { caller, user };
}

test('it retrieves all characters for a user', async () => {
  await using handle = await createTestDB();

  const { db } = handle;
  const { caller, user } = await setupTest({ db });

  const character = await caller.createCharacter({
    name: 'Test Character',
    userID: user.id,
  });

  const result = await caller.getCharacters({
    userID: user.id,
  });

  expect(result).toStrictEqual([character]);
});

test('it returns an empty array when no characters exist', async () => {
  await using handle = await createTestDB();

  const { db } = handle;
  const { caller, user } = await setupTest({ db });

  const result = await caller.getCharacters({
    userID: user.id,
  });

  expect(result).toStrictEqual([]);
});
