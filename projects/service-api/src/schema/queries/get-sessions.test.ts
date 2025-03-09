import { env } from '~/env';
import { db } from '~/mocks/db';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { createTestJWT } from '@chrono/service-test-utils';
import { drop } from '@mswjs/data';
import { resolve } from './get-sessions';

test('it returns all sessions for the authenticated user', async () => {
  const user = db.user.create({});

  const session1 = db.session.create({
    userID: user.id,
  });

  const session2 = db.session.create({
    userID: user.id,
  });

  const accessToken = await createTestJWT({
    sub: user.id,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
  });

  const ctx = createMockGQLContext({ accessToken, user, session: session1 });

  const args = { input: {} };

  const result = await resolve({}, args, ctx);

  expect(result).toBeArray();
  expect(result).toHaveLength(2);
  expect(result).toIncludeAllPartialMembers([
    {
      id: session1.id,
      userID: user.id,
      ipAddress: session1.ipAddress,
      expiresAt: expect.any(Date),
    },
    {
      id: session2.id,
      userID: user.id,
      ipAddress: session2.ipAddress,
      expiresAt: expect.any(Date),
    },
  ]);

  drop(db);
});

test('it returns an error if the user isnt authenticated', async () => {
  const ctx = createMockGQLContext({});
  const args = { input: {} };

  await expect(() => resolve({}, args, ctx)).rejects.toThrow('Unauthorized');
});
