import { afterEach, expect, test } from 'vitest';
import { drop } from '@mswjs/data';
import { createTestJWT } from '@vers/service-test-utils';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { server } from '~/mocks/node';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { resolve } from './get-characters';

afterEach(() => {
  drop(db);
  server.resetHandlers();
});

test('it returns all characters for the authenticated user', async () => {
  const user = db.user.create({});
  const otherUser = db.user.create({});

  const character1 = db.character.create({
    userID: user.id,
  });

  const character2 = db.character.create({
    userID: user.id,
  });

  // Create a character for another user - should not be returned
  db.character.create({
    userID: otherUser.id,
  });

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
    sub: user.id,
  });

  const ctx = createMockGQLContext({ accessToken, user });
  const args = { input: {} };

  const result = await resolve({}, args, ctx);

  expect(result).toBeArray();
  expect(result).toHaveLength(2);
  expect(result).toIncludeAllPartialMembers([
    {
      createdAt: expect.any(Date),
      id: character1.id,
      level: character1.level,
      name: character1.name,
      updatedAt: expect.any(Date),
      userID: user.id,
      xp: character1.xp,
    },
    {
      createdAt: expect.any(Date),
      id: character2.id,
      level: character2.level,
      name: character2.name,
      updatedAt: expect.any(Date),
      userID: user.id,
      xp: character2.xp,
    },
  ]);
});

test('it returns an empty array when user has no characters', async () => {
  const user = db.user.create({});

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
    sub: user.id,
  });

  const ctx = createMockGQLContext({ accessToken, user });
  const args = { input: {} };

  const result = await resolve({}, args, ctx);

  expect(result).toBeArray();
  expect(result).toHaveLength(0);
});

test('it returns an unauthorized error when the user is not authenticated', async () => {
  const ctx = createMockGQLContext({});
  const args = { input: {} };

  await expect(() => resolve({}, args, ctx)).rejects.toThrow('Unauthorized');
});
