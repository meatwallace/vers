import { expect, test } from 'vitest';
import { CombinedError } from '@urql/core';
import { handleGQLError } from './handle-gql-error.ts';

test('it rethrows redirects', () => {
  const error = new CombinedError({
    // @ts-expect-error - networkError is typed as an Error
    networkError: new Response('Redirect', { status: 302 }),
  });

  expect(() => handleGQLError(error)).toThrow(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    expect.objectContaining({
      status: 302,
    }),
  );
});

test('it does nothing if the network error is not a redirect', () => {
  const error = new CombinedError({
    networkError: new Error('Not found'),
  });

  expect(() => handleGQLError(error)).not.toThrow();
});
