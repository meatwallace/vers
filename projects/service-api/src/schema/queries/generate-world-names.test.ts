import { drop } from '@mswjs/data';
import { createTestJWT } from '@chrono/service-test-utils';
import { env } from '~/env';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { db } from '~/mocks/db';
import { resolve } from './generate-world-names';

test('it returns a list of generated world names', async () => {
  const user = db.user.create({});

  const accessToken = await createTestJWT({
    sub: user.id,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
  });

  const ctx = createMockGQLContext({ accessToken, user });
  const args = { input: { worldID: 'test_id' } };
  const result = await resolve({}, args, ctx);

  expect(result).toBeArray();
  expect(result).toHaveLength(5);
  expect(result).toSatisfyAll((name) => typeof name === 'string');

  drop(db);
});

test('it returns an error if the user isnt authenticated', async () => {
  const ctx = createMockGQLContext({});
  const args = { input: { worldID: 'test_id' } };

  await expect(() => resolve({}, args, ctx)).rejects.toThrow('Unauthorized');
});
