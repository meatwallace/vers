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

test('it deletes a character', async () => {
  await using handle = await createTestDB();

  const { db } = handle;
  const { caller, user } = await setupTest({ db });

  const character = await caller.createCharacter({
    name: 'Test Character',
    userID: user.id,
  });

  await caller.deleteCharacter({
    id: character.id,
  });

  const deleted = await db.query.characters.findFirst({
    where: (characters, { eq }) => eq(characters.id, character.id),
  });

  expect(deleted).toBeUndefined();
});

test('it throws an error when character is not found', async () => {
  await using handle = await createTestDB();

  const { db } = handle;
  const { caller } = await setupTest({ db });

  await expect(
    caller.deleteCharacter({
      id: createId(),
    }),
  ).rejects.toMatchObject({
    code: 'NOT_FOUND',
    message: 'Character not found',
  });
});
