import { isMutationError } from './is-mutation-error';

test('it returns true if the provided data is a mutation error', () => {
  const result = isMutationError({
    error: {
      message: 'Test error',
    },
  });

  expect(result).toBeTrue();
});

test('it returns false if the provided data is not a mutation error', () => {
  const result = isMutationError({
    data: {
      test: true,
    },
  });

  expect(result).toBeFalse();
});
