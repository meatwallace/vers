import { drop } from '@mswjs/data';
import { createMockGQLContext } from '~/test-utils/create-mock-gql-context';
import { db } from '~/mocks/db';
import { VerificationType } from '../types/verification-type';
import { resolve } from './verify-otp';

test('it verifies a valid OTP', async () => {
  const verification = db.verification.create({
    type: 'onboarding',
    target: 'test@example.com',
  });

  const ctx = createMockGQLContext({});
  const args = {
    input: {
      code: '999123',
      type: VerificationType.ONBOARDING,
      target: 'test@example.com',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    type: verification.type,
    target: verification.target,
  });

  drop(db);
});

test('it returns an error for an invalid OTP', async () => {
  const ctx = createMockGQLContext({});
  const args = {
    input: {
      code: 'invalid',
      type: VerificationType.ONBOARDING,
      target: 'test@example.com',
    },
  };

  const result = await resolve({}, args, ctx);

  expect(result).toMatchObject({
    error: {
      title: 'Invalid OTP',
      message: 'The OTP is invalid',
    },
  });

  drop(db);
});
