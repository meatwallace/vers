import type { CombinedError } from '@urql/core';
import { captureException } from '@sentry/react';

export function captureGQLExceptions(error: CombinedError) {
  if (error.networkError) {
    captureException(error.networkError);
  }

  for (const err of error.graphQLErrors) {
    captureException(err);
  }
}
