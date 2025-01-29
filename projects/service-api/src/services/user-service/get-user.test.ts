import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { ServiceID } from '@chrono/service-types';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { getUser } from './get-user';

test('it returns the requested user by id', async () => {
  const user = db.user.create({
    id: 'test_id',
    email: 'user@test.com',
    name: 'Test User',
    username: 'test_user',
  });

  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
    apiURL: env.USERS_SERVICE_URL,
  });

  const args = { id: user.id };

  const result = await getUser(args, ctx);

  expect(result).toMatchObject({
    id: 'test_id',
    email: 'user@test.com',
    name: 'Test User',
    username: 'test_user',
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  });

  drop(db);
});

test('it returns the requested user by email', async () => {
  const user = db.user.create({
    id: 'test_id',
    email: 'user@test.com',
    name: 'Test User',
    username: 'test_user',
  });

  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
    apiURL: env.USERS_SERVICE_URL,
  });

  const args = { email: user.email };

  const result = await getUser(args, ctx);

  expect(result).toMatchObject({
    id: user.id,
    email: user.email,
    name: user.name,
    username: user.username,
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  });

  drop(db);
});

test('it returns null if the user does not exist', async () => {
  const ctx = createServiceContext({
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
    apiURL: env.USERS_SERVICE_URL,
  });

  const args = { id: 'test_id' };

  const result = await getUser(args, ctx);

  expect(result).toBeNull();
});
