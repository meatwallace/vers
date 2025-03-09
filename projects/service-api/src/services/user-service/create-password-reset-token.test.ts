import { ServiceID } from '@chrono/service-types';
import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { createPasswordResetToken } from './create-password-reset-token';

test('it creates a password reset token for an existing user', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    name: 'Test User',
    passwordHash: 'hashed_password',
    username: 'test_user',
  });

  const ctx = createServiceContext({
    apiURL: env.USERS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
  });

  const args = { id: user.id };

  const result = await createPasswordResetToken(args, ctx);

  expect(result).toMatchObject(expect.any(String));

  drop(db);
});

test('it throws an error if the user does not exist', async () => {
  const ctx = createServiceContext({
    apiURL: env.USERS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
  });

  const args = { id: 'nonexistent_id' };

  await expect(createPasswordResetToken(args, ctx)).rejects.toThrow(
    'An unknown error occurred',
  );

  drop(db);
});

test('it throws an error if the user has no password', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    name: 'Test User',
    passwordHash: null,
    username: 'test_user',
  });

  const ctx = createServiceContext({
    apiURL: env.USERS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
  });

  const args = { id: user.id };

  await expect(createPasswordResetToken(args, ctx)).rejects.toThrow(
    'An unknown error occurred',
  );

  drop(db);
});
