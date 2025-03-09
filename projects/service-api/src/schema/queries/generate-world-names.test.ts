import { createTestJWT } from '@chrono/service-test-utils';
import { drop } from '@mswjs/data';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { resolve } from './generate-world-names';

test('it returns a list of generated world names', async () => {
  const user = db.user.create({});

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
    sub: user.id,
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
