import { drop } from '@mswjs/data';
import { createTestJWT } from '@chrono/service-test-utils';
import { createId } from '@paralleldrive/cuid2';
import { ServiceID } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { createUser } from './create-user';

test('it creates a new user', async () => {
  const user = db.user.create({});

  const accessToken = await createTestJWT({
    sub: user.id,
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
  });

  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
    apiURL: env.USERS_SERVICE_URL,
    accessToken,
  });

  const args = {
    email: 'user@test.com',
    name: 'Test User',
    username: 'test_user',
    password: 'test_password',
  };

  const result = await createUser(args, ctx);

  expect(result).toMatchObject({
    id: expect.any(String),
    email: args.email,
    name: args.name,
    username: args.username,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  });

  drop(db);
});
