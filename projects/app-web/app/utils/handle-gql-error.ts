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
    throw error;
  }

  captureGQLExceptions(error);
}

function isRedirectResponse(error: unknown): error is Response {
  return error instanceof Response && error.status === 302;
}
