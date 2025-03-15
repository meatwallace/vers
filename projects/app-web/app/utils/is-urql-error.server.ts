import { CombinedError } from '@urql/core';

export function isURQLError(error: unknown): error is CombinedError {
  return error instanceof CombinedError;
}
