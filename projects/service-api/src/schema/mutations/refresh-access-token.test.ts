import { drop } from '@mswjs/data';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { db } from '~/mocks/db';
import { resolve } from './refresh-access-token';

test('it refreshes access token with valid refresh token', async () => {
  const user = db.user.create({});

  const session = db.session.create({
    userID: user.id,
    refreshToken: 'valid_refresh_token',
  });

  const ctx = createMockGQLContext({
    user,
  });

  const args = {
    input: {
      refreshToken: session.refreshToken,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    accessToken: expect.any(String),
    refreshToken: expect.any(String),
    session: {
      id: expect.any(String),
      userID: user.id,
      ipAddress: session.ipAddress,
      expiresAt: expect.any(Date),
    },
  });

  // verify old refresh token is no longer valid
  const oldSession = db.session.findFirst({
    where: { refreshToken: { equals: session.refreshToken } },
  });

  expect(oldSession).toBeNull();

  drop(db);
});

test('it fails to refresh with invalid refresh token', async () => {
  const ctx = createMockGQLContext({});
  const args = {
    input: {
      refreshToken: 'invalid_refresh_token',
    },
  };

  await expect(() => resolve({}, args, ctx)).rejects.toThrow();

  drop(db);
});
