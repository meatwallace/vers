import { expect, test } from 'vitest';
import { is2FARequiredPayload } from './is-2fa-required-payload';

test('it returns true if the provided data is a 2fa required payload', () => {
  const result = is2FARequiredPayload({
    transactionID: '123',
  });

  expect(result).toBeTrue();
});

test('it returns false if the provided data is not a 2fa required payload', () => {
  const result = is2FARequiredPayload({
    data: {
      test: true,
    },
  });

  expect(result).toBeFalse();
});
