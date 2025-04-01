import { afterEach, expect, test } from 'vitest';
import { drop } from '@mswjs/data';
import { createTestJWT } from '@vers/service-test-utils';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { server } from '~/mocks/node';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { resolve } from './create-character';

afterEach(() => {
  drop(db);
  server.resetHandlers();
});

test('it creates a character when the user has none', async () => {
  const user = db.user.create({});

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
    sub: user.id,
  });

  const ctx = createMockGQLContext({ accessToken, user });
  const args = {
    input: {
      name: 'Test Character',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({
    createdAt: expect.any(Date),
    id: expect.any(String),
    level: 1,
    name: 'Test Character',
    updatedAt: expect.any(Date),
    userID: user.id,
    xp: 0,
  });

  const character = db.character.findFirst({
    where: {
      userID: { equals: user.id },
    },
  });

  expect(character).toMatchObject({
    createdAt: expect.any(Date),
    id: expect.any(String),
    level: 1,
    name: 'Test Character',
    updatedAt: expect.any(Date),
    userID: user.id,
    xp: 0,
  });
});

test('it returns an error when the user has reached their character limit', async () => {
  const user = db.user.create({});

  db.character.create({ name: 'Character #1', userID: user.id });
  db.character.create({ name: 'Character #2', userID: user.id });

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
    sub: user.id,
  });

  const ctx = createMockGQLContext({ accessToken, user });

  const args = {
    input: {
      name: 'Character #3',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({
    error: {
      message: 'Please delete one of your characters and try again.',
      title: 'Character limit reached',
    },
  });
});

test('it returns an error when the character name is already taken', async () => {
  const user = db.user.create({});

  db.character.create({
    name: 'Existing Character',
    userID: 'any_other_user_id',
  });

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
    sub: user.id,
  });

  const ctx = createMockGQLContext({ accessToken, user });

  const args = {
    input: {
      name: 'Existing Character',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({
    error: {
      message: 'A character with this name already exists.',
      title: 'Character name taken',
    },
  });
});

test('it returns an unauthorized error when the user is not authenticated', async () => {
  const ctx = createMockGQLContext({});
  const args = {
    input: {
      name: 'Test Character',
    },
  };

  await expect(() => resolve({}, args, ctx)).rejects.toThrow('Unauthorized');
});
