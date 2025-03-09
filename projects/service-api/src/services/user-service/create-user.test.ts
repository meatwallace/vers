import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { createTestJWT } from '@vers/service-test-utils';
import { ServiceID } from '@vers/service-types';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { createUser } from './create-user';

test('it creates a new user', async () => {
  const user = db.user.create({});

  const accessToken = await createTestJWT({
    audience: env.API_IDENTIFIER,
    issuer: `https://${env.API_IDENTIFIER}/`,
    sub: user.id,
  });

  const ctx = createServiceContext({
    accessToken,
    apiURL: env.USERS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
  });

  const args = {
    email: 'user@test.com',
    name: 'Test User',
    password: 'test_password',
    username: 'test_user',
  };

  const result = await createUser(args, ctx);

  expect(result).toMatchObject({
    createdAt: expect.any(Date),
    email: args.email,
    id: expect.any(String),
    name: args.name,
    updatedAt: expect.any(Date),
    username: args.username,
  });

  drop(db);
});
