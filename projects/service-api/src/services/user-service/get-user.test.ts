import { ServiceID } from '@chrono/service-types';
import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { getUser } from './get-user';

test('it returns the requested user by id', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    id: 'test_id',
    name: 'Test User',
    username: 'test_user',
  });

  const ctx = createServiceContext({
    apiURL: env.USERS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
  });

  const args = { id: user.id };

  const result = await getUser(args, ctx);

  expect(result).toMatchObject({
    createdAt: expect.any(Date),
    email: 'user@test.com',
    id: 'test_id',
    name: 'Test User',
    updatedAt: expect.any(Date),
    username: 'test_user',
  });

  drop(db);
});

test('it returns the requested user by email', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    id: 'test_id',
    name: 'Test User',
    username: 'test_user',
  });

  const ctx = createServiceContext({
    apiURL: env.USERS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
  });

  const args = { email: user.email };

  const result = await getUser(args, ctx);

  expect(result).toMatchObject({
    createdAt: expect.any(Date),
    email: user.email,
    id: user.id,
    name: user.name,
    updatedAt: expect.any(Date),
    username: user.username,
  });

  drop(db);
});

test('it returns null if the user does not exist', async () => {
  const ctx = createServiceContext({
    apiURL: env.USERS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
  });

  const args = { id: 'test_id' };

  const result = await getUser(args, ctx);

  expect(result).toBeNull();
});
