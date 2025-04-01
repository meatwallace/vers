import { afterEach, expect, test } from 'vitest';
import { drop } from '@mswjs/data';
import { createTestJWT } from '@vers/service-test-utils';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { server } from '~/mocks/node';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { resolve } from './update-character';

afterEach(() => {
  drop(db);
  server.resetHandlers();
});

test('it updates a character when found', async () => {
  const user = db.user.create({});
  const character = db.character.create({
    name: 'Original Name',
    userID: user.id,
  });

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
    sub: user.id,
  });

  const ctx = createMockGQLContext({ accessToken, user });

  const args = {
    input: {
      id: character.id,
      name: 'Updated Name',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({ success: true });

  const updatedCharacter = db.character.findFirst({
    where: {
      id: { equals: character.id },
    },
  });

  expect(updatedCharacter).toMatchObject({
    createdAt: expect.any(Date),
    id: character.id,
    level: character.level,
    name: 'Updated Name',
    updatedAt: expect.any(Date),
    userID: user.id,
    xp: character.xp,
  });
});

test('it returns an unauthorized error when the user is not authenticated', async () => {
  const ctx = createMockGQLContext({});

  const args = {
    input: {
      id: 'test_id',
      name: 'Updated Name',
    },
  };

  await expect(() => resolve({}, args, ctx)).rejects.toThrow('Unauthorized');
});
