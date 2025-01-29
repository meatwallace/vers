import { drop } from '@mswjs/data';
import { createTestJWT } from '@chrono/service-test-utils';
import { db } from '~/mocks/db';
import { env } from '~/env';
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
    sub: user.id,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
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
