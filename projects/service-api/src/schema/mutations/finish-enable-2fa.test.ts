import invariant from 'tiny-invariant';
import { drop } from '@mswjs/data';
import { db } from '~/mocks/db';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { createPendingTransaction } from '~/utils/create-pending-transaction';
import { createTransactionToken } from '~/utils/create-transaction-token';
import { VerificationType } from '../types/verification-type';
import { resolve } from './finish-enable-2fa';

afterEach(() => {
  drop(db);
});

test('it successfully completes 2FA setup', async () => {
  const user = db.user.create({
    email: 'test@example.com',
  });

  const verification = db.verification.create({
    id: 'setup-verification-id',
    type: '2fa-setup',
    target: user.email,
    secret: 'ABCDEFGHIJKLMNOP',
    algorithm: 'SHA-1',
    digits: 6,
    period: 30,
    charSet: 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
  });

  const ctx = createMockGQLContext({ user });

  invariant(ctx.session, 'session is required');

  const transactionID = createPendingTransaction({
    target: user.email,
    ipAddress: ctx.ipAddress,
    action: VerificationType.TWO_FACTOR_AUTH_SETUP,
    sessionID: ctx.session.id,
  });

  const transactionToken = await createTransactionToken(
    {
      target: user.email,
      action: VerificationType.TWO_FACTOR_AUTH_SETUP,
      ipAddress: ctx.ipAddress,
      transactionID,
      sessionID: ctx.session.id,
    },
    ctx,
  );

  const args = {
    input: {
      transactionToken,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toEqual({ success: true });

  // Verify that the verification record was updated
  const updatedVerification = db.verification.findFirst({
    where: {
      id: { equals: verification.id },
    },
  });

  expect(updatedVerification).toMatchObject({
    type: '2fa',
  });
});

test('it returns an error if the transaction token is invalid', async () => {
  const user = db.user.create({
    email: 'test@example.com',
  });

  db.verification.create({
    type: '2fa-setup',
    target: user.email,
  });

  const ctx = createMockGQLContext({ user });

  const args = {
    input: {
      transactionToken: 'test-transaction-token',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toEqual({
    error: {
      title: 'Failed Verification',
      message: 'Verification for this operation is invalid or has expired.',
    },
  });
});

test('it returns an error if there is no 2FA verification record', async () => {
  const user = db.user.create({
    email: 'test@example.com',
  });

  const ctx = createMockGQLContext({ user });

  invariant(ctx.session, 'session is required');

  const transactionID = createPendingTransaction({
    target: user.email,
    ipAddress: ctx.ipAddress,
    action: VerificationType.TWO_FACTOR_AUTH_SETUP,
    sessionID: ctx.session.id,
  });

  const transactionToken = await createTransactionToken(
    {
      target: user.email,
      action: VerificationType.TWO_FACTOR_AUTH_SETUP,
      ipAddress: ctx.ipAddress,
      transactionID,
      sessionID: ctx.session.id,
    },
    ctx,
  );

  const args = {
    input: {
      transactionToken,
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toEqual({
    error: {
      title: 'Failed Verification',
      message: 'Verification for this operation is invalid or has expired.',
    },
  });
});

test('it returns an error if unauthorized', async () => {
  const ctx = createMockGQLContext({});

  const args = {
    input: {
      transactionToken: 'test-transaction-token',
    },
  };

  await expect(resolve({}, args, ctx)).rejects.toThrow('Unauthorized');
});
