import { afterEach, expect, test } from 'vitest';
import { drop } from '@mswjs/data';
import { db } from '~/mocks/db';
import { VerificationType } from '~/schema/types/verification-type';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { createPendingTransaction } from './create-pending-transaction';
import { createTransactionToken } from './create-transaction-token';
import { verifyTransactionToken } from './verify-transaction-token';

afterEach(() => {
  vi.useRealTimers();

  drop(db);
});

test('it returns true when no token is provided', async () => {
  const ctx = createMockGQLContext({});

  const data = {
    token: null,
    target: 'user_123',
    action: VerificationType.ONBOARDING,
  };

  const result = await verifyTransactionToken(data, ctx);

  expect(result).toBeNull();
});

test('it validates a token with matching action, target, and IP', async () => {
  const transactionID = createPendingTransaction({
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.ONBOARDING,
    sessionID: null,
  });

  const tokenParts = {
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.ONBOARDING,
    transactionID,
    sessionID: null,
  };

  const ctx = createMockGQLContext({ ipAddress: '127.0.0.1' });
  const token = await createTransactionToken(tokenParts, ctx);

  const result = await verifyTransactionToken(
    {
      token,
      action: VerificationType.ONBOARDING,
      target: 'user_123',
    },
    ctx,
  );

  expect(result).toMatchObject({
    amr: ['otp'],
    mfa_verified: true,
    ip_address: '127.0.0.1',
    auth_time: expect.any(Number),
    action: 'ONBOARDING',
    sub: 'user_123',
    transaction_id: transactionID,
    session_id: null,
  });
});

test('it returns null when action does not match', async () => {
  const transactionID = createPendingTransaction({
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.ONBOARDING,
    sessionID: null,
  });

  const data = {
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.ONBOARDING,
    transactionID,
    sessionID: null,
  };

  const ctx = createMockGQLContext({ ipAddress: '127.0.0.1' });
  const token = await createTransactionToken(data, ctx);

  const result = await verifyTransactionToken(
    {
      token,
      action: VerificationType.CHANGE_EMAIL,
      target: 'user_123',
    },
    ctx,
  );

  expect(result).toBeNull();
});

test('it returns null when IP address does not match', async () => {
  const transactionID = createPendingTransaction({
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.ONBOARDING,
    sessionID: null,
  });

  const data = {
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.ONBOARDING,
    transactionID,
    sessionID: null,
  };

  const ctx = createMockGQLContext({ ipAddress: '192.168.1.1' });
  const token = await createTransactionToken(data, ctx);

  const result = await verifyTransactionToken(
    {
      token,
      action: VerificationType.ONBOARDING,
      target: 'user_123',
    },
    ctx,
  );

  expect(result).toBeNull();
});

test('it returns null when token is reused', async () => {
  const transactionID = createPendingTransaction({
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.ONBOARDING,
    sessionID: null,
  });

  const data = {
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.ONBOARDING,
    transactionID,
    sessionID: null,
  };

  const ctx = createMockGQLContext({ ipAddress: '127.0.0.1' });
  const token = await createTransactionToken(data, ctx);

  // First use should succeed
  const firstResult = await verifyTransactionToken(
    {
      token,
      action: VerificationType.ONBOARDING,
      target: 'user_123',
    },
    ctx,
  );

  expect(firstResult).toMatchObject({
    transaction_id: transactionID,
  });

  // Second use should fail
  const secondResult = await verifyTransactionToken(
    {
      token,
      action: VerificationType.ONBOARDING,
      target: 'user_123',
    },
    ctx,
  );

  expect(secondResult).toBeNull();
});

test('it validates session for actions that require it', async () => {
  const session = db.session.create({
    userID: 'user_123',
  });

  const transactionID = createPendingTransaction({
    target: 'user_123',
    ipAddress: session.ipAddress,
    action: VerificationType.CHANGE_EMAIL,
    sessionID: session.id,
  });

  const data = {
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.CHANGE_EMAIL,
    transactionID,
    sessionID: session.id,
  };

  const ctx = createMockGQLContext({ session });

  const token = await createTransactionToken(data, ctx);

  const result = await verifyTransactionToken(
    {
      token,
      action: VerificationType.CHANGE_EMAIL,
      target: 'user_123',
    },
    ctx,
  );

  expect(result).toMatchObject({
    transaction_id: transactionID,
  });
});

test('it returns null when session is required but not found', async () => {
  // we need to create the session temporarily for our token to be successfully created
  const session = db.session.create({
    userID: 'user_123',
    ipAddress: '127.0.0.1',
  });

  const transactionID = createPendingTransaction({
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.CHANGE_EMAIL,
    sessionID: session.id,
  });

  const data = {
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.CHANGE_EMAIL,
    transactionID,
    sessionID: session.id,
  };

  const ctx = createMockGQLContext({ ipAddress: '127.0.0.1' });
  const token = await createTransactionToken(data, ctx);

  // delete the session prior to verifying the token
  db.session.delete({
    where: {
      id: { equals: data.sessionID },
    },
  });

  const result = await verifyTransactionToken(
    {
      token,
      action: VerificationType.CHANGE_EMAIL,
      target: 'user_123',
    },
    ctx,
  );

  expect(result).toBeNull();
});

test('it returns null when session ID does not match', async () => {
  const pendingTransactionSession = db.session.create({
    userID: 'user_123',
    ipAddress: '127.0.0.1',
  });

  const transactionID = createPendingTransaction({
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.CHANGE_EMAIL,
    sessionID: pendingTransactionSession.id,
  });

  const verifySession = db.session.create({
    userID: 'user_123',
    ipAddress: '127.0.0.1',
  });

  const pendingTransactionContext = createMockGQLContext({
    ipAddress: '127.0.0.1',
    session: pendingTransactionSession,
  });

  const verifySessionContext = createMockGQLContext({
    ipAddress: '127.0.0.1',
    session: verifySession,
  });

  const data = {
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.CHANGE_EMAIL,
    transactionID,
    sessionID: pendingTransactionSession.id,
  };

  const token = await createTransactionToken(data, pendingTransactionContext);

  const result = await verifyTransactionToken(
    {
      token,
      action: VerificationType.CHANGE_EMAIL,
      target: 'user_123',
    },
    verifySessionContext,
  );

  expect(result).toBeNull();
});

test('it returns null when token is expired', async () => {
  vi.useFakeTimers();

  const transactionID = createPendingTransaction({
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.TWO_FACTOR_AUTH,
    sessionID: null,
  });

  const data = {
    target: 'user_123',
    ipAddress: '127.0.0.1',
    action: VerificationType.TWO_FACTOR_AUTH,
    transactionID,
    sessionID: null,
  };

  const ctx = createMockGQLContext({ ipAddress: '127.0.0.1' });
  const token = await createTransactionToken(data, ctx);

  const twoMinutesInMS = 2 * 60 * 1000;

  // Wait for token to expire (2 minutes + buffer)
  vi.setSystemTime(Date.now() + twoMinutesInMS + 1000);

  const result = await verifyTransactionToken(
    {
      token,
      action: VerificationType.TWO_FACTOR_AUTH,
      target: 'user_123',
    },
    ctx,
  );

  expect(result).toBeNull();
});
