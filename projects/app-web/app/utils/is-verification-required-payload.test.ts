import { expect, test } from 'vitest';
import { isVerificationRequiredPayload } from './is-verification-required-payload';

test('it returns true if the provided data is a 2fa required payload', () => {
  const result = isVerificationRequiredPayload({
    transactionID: '123',
  });

  expect(result).toBeTrue();
});

test('it returns false if the provided data is not a verification required payload', () => {
  const result = isVerificationRequiredPayload({
    test: true,
  });

  expect(result).toBeFalse();
});
