import { afterEach, expect, test } from 'vitest';
import { drop } from '@mswjs/data';
import { createTestJWT } from '@vers/service-test-utils';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { server } from '~/mocks/node';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { resolve } from './delete-character';

afterEach(() => {
  drop(db);
  server.resetHandlers();
});

test('it deletes a character when found', async () => {
  const user = db.user.create({});
  const character = db.character.create({
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
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toStrictEqual({
    success: true,
  });

  const deletedCharacter = db.character.findFirst({
    where: {
      id: { equals: character.id },
    },
  });

  expect(deletedCharacter).toBeNull();
});

test('it returns an unauthorized error when the user is not authenticated', async () => {
  const ctx = createMockGQLContext({});
  const args = {
    input: {
      id: 'test_id',
    },
  };

  await expect(() => resolve({}, args, ctx)).rejects.toThrow('Unauthorized');
});
