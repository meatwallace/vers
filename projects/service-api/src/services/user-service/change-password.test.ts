import { ServiceID } from '@chrono/service-types';
import { drop } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { env } from '~/env';
import { db } from '~/mocks/db';
import { createServiceContext } from '../utils';
import { changePassword } from './change-password';

test('it changes the password for an existing user', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    name: 'Test User',
    passwordHash: 'hashed_password',
    passwordResetToken: 'valid_reset_token',
    passwordResetTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    username: 'test_user',
  });

  const ctx = createServiceContext({
    apiURL: env.USERS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
  });

  const args = {
    id: user.id,
    password: 'new_password',
    resetToken: 'valid_reset_token',
  };

  const result = await changePassword(args, ctx);

  expect(result).toBe(true);

  const updatedUser = db.user.findFirst({
    where: {
      id: { equals: user.id },
    },
  });

  expect(updatedUser?.passwordHash).not.toEqual(user.passwordHash);

  drop(db);
});

test('it throws an error if the user does not exist', async () => {
  const ctx = createServiceContext({
    apiURL: env.USERS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
  });

  const args = {
    id: 'nonexistent_id',
    password: 'new_password',
    resetToken: 'valid_reset_token',
  };

  await expect(changePassword(args, ctx)).rejects.toThrow(
    'An unknown error occurred',
  );

  drop(db);
});

test('it throws an error if the reset token is invalid', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    name: 'Test User',
    passwordHash: 'hashed_password',
    passwordResetToken: 'valid_reset_token',
    passwordResetTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    username: 'test_user',
  });

  const ctx = createServiceContext({
    apiURL: env.USERS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
  });

  const args = {
    id: user.id,
    password: 'new_password',
    resetToken: 'invalid_reset_token',
  };

  await expect(changePassword(args, ctx)).rejects.toThrow(
    'An unknown error occurred',
  );

  drop(db);
});

test('it throws an error if the reset token is expired', async () => {
  const user = db.user.create({
    email: 'user@test.com',
    name: 'Test User',
    passwordHash: 'hashed_password',
    passwordResetToken: 'valid_reset_token',
    passwordResetTokenExpiresAt: new Date(Date.now() - 1000), // expired
    username: 'test_user',
  });

  const ctx = createServiceContext({
    apiURL: env.USERS_SERVICE_URL,
    requestID: createId(),
    serviceID: ServiceID.ServiceUser,
  });

  const args = {
    id: user.id,
    password: 'new_password',
    resetToken: 'valid_reset_token',
  };

  await expect(changePassword(args, ctx)).rejects.toThrow(
    'An unknown error occurred',
  );

  drop(db);
});
