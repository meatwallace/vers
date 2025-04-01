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

test('it creates a character with default values', async () => {
  await using handle = await createTestDB();

  const { db } = handle;
  const { caller, user } = await setupTest({ db });

  const input = {
    name: 'Test Character',
    userID: user.id,
  };

  const result = await caller.createCharacter(input);

  expect(result).toStrictEqual({
    createdAt: expect.any(Date),
    id: expect.any(String),
    level: 1,
    name: input.name,
    updatedAt: expect.any(Date),
    userID: input.userID,
    xp: 0,
  });

  const character = await db.query.characters.findFirst({
    where: (characters, { eq }) => eq(characters.id, result.id),
  });

  expect(character).toStrictEqual(result);
});

test('it throws an error if a character with the same name already exists', async () => {
  await using handle = await createTestDB();

  const { db } = handle;
  const { caller, user } = await setupTest({ db });

  await caller.createCharacter({
    name: 'Character #1',
    userID: user.id,
  });

  await expect(
    caller.createCharacter({
      name: 'Character #1',
      userID: user.id,
    }),
  ).rejects.toMatchObject({
    code: 'CONFLICT',
    message: 'A character with that name already exists',
  });
});
