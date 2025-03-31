import { expect, test } from 'vitest';
import { createId } from '@paralleldrive/cuid2';
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

test('it retrieves a character by id', async () => {
  await using handle = await createTestDB();

  const { db } = handle;
  const { caller, user } = await setupTest({ db });

  const character = await caller.createCharacter({
    name: 'Test Character',
    userID: user.id,
  });

  const result = await caller.getCharacter({
    id: character.id,
  });

  expect(result).toStrictEqual(character);
});

test('it returns null when character is not found', async () => {
  await using handle = await createTestDB();

  const { db } = handle;
  const { caller } = await setupTest({ db });

  const result = await caller.getCharacter({
    id: createId(),
  });

  expect(result).toBeNull();
});
