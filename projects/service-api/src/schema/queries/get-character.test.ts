import { afterEach, expect, test } from 'vitest';
import { drop } from '@mswjs/data';
import { createTestJWT } from '@vers/service-test-utils';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { server } from '~/mocks/node';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { resolve } from './get-character';

afterEach(() => {
  drop(db);
  server.resetHandlers();
});

test('it returns a character when found', async () => {
  const user = db.user.create({});

  const character = db.character.create({
    level: 1,
    name: 'Test Character',
    userID: user.id,
    xp: 0,
  });

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
    sub: user.id,
  });

  const ctx = createMockGQLContext({ accessToken, user });
  const args = { input: { id: character.id } };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({
    createdAt: expect.any(Date),
    id: character.id,
    level: 1,
    name: 'Test Character',
    updatedAt: expect.any(Date),
    userID: user.id,
    xp: 0,
  });
});

test('it returns null when character is not found', async () => {
  const user = db.user.create({});

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
    sub: user.id,
  });

  const ctx = createMockGQLContext({ accessToken, user });
  const args = { input: { id: 'non_existent_id' } };

  const result = await resolve({}, args, ctx);

  expect(result).toBeNull();
});

test('it returns an unauthorized error when the user is not authenticated', async () => {
  const ctx = createMockGQLContext({});
  const args = { input: { id: 'test_id' } };

  await expect(() => resolve({}, args, ctx)).rejects.toThrow('Unauthorized');
});
