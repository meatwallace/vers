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

test('it updates a character name', async () => {
  await using handle = await createTestDB();

  const { db } = handle;
  const { caller, user } = await setupTest({ db });

  const character = await caller.createCharacter({
    name: 'Original Name',
    userID: user.id,
  });

  const result = await caller.updateCharacter({
    id: character.id,
    name: 'Updated Name',
    userID: user.id,
  });

  expect(result).toStrictEqual({
    updatedID: character.id,
  });

  const updated = await db.query.characters.findFirst({
    where: (characters, { eq }) => eq(characters.id, character.id),
  });

  expect(updated).toStrictEqual({
    ...character,
    name: 'Updated Name',
    updatedAt: expect.any(Date),
  });
});

test('it throws an error when character is not found', async () => {
  await using handle = await createTestDB();

  const { db } = handle;
  const { caller, user } = await setupTest({ db });

  await expect(
    caller.updateCharacter({
      id: createId(),
      name: 'New Name',
      userID: user.id,
    }),
  ).rejects.toMatchObject({
    code: 'NOT_FOUND',
    message: 'Character not found',
  });
});
