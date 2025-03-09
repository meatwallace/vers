import { createTestJWT } from '@chrono/service-test-utils';
import { drop } from '@mswjs/data';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { resolve } from './get-current-user';

test('it returns the current user', async () => {
  const user = db.user.create({});

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
    sub: user.id,
  });

  const ctx = createMockGQLContext({ accessToken, user });
  const result = await resolve({}, {}, ctx);

  expect(result).toMatchObject({
    email: user.email,
    id: user.id,
    name: user.name,
    username: user.username,
  });

  drop(db);
});

test('it returns an error if the user isnt authenticated', async () => {
  const ctx = createMockGQLContext({});

  await expect(() => resolve({}, {}, ctx)).rejects.toThrow('Unauthorized');
});
