import type { CombinedError } from '@urql/core';
import { captureGQLExceptions } from './capture-gql-exceptions.server';

/**
 * Generic error handling for URQL's CombinedError type.
 *
 * If we catch a redirect response from our auth token refresh, we throw it.
 *
 * Otherwise, we capture all the exceptions we have to Sentry and do nothing.
 */
export function handleGQLError(error: CombinedError) {
  if (isRedirectResponse(error)) {
    throw error.networkError;
  }

  captureGQLExceptions(error);
}

function isRedirectResponse(error: CombinedError) {
  return (
    error.networkError instanceof Response && error.networkError.status === 302
  );
}
