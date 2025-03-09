import { createTestJWT } from '@chrono/service-test-utils';
import { drop } from '@mswjs/data';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { server } from '~/mocks/node';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { resolve } from './delete-session';

afterEach(() => {
  drop(db);

  server.resetHandlers();
});

test('it deletes a session when the user is authenticated', async () => {
  const user = db.user.create({});

  const session = db.session.create({
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
      id: session.id,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    success: true,
  });

  const deletedSession = db.session.findFirst({
    where: {
      id: { equals: session.id },
    },
  });

  expect(deletedSession).toBeNull();
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
