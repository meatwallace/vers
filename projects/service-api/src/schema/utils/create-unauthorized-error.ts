import { MutationError } from '../types/mutation-error';

export function createUnauthorizedError(): typeof MutationError.$inferType {
  return {
    title: 'Unauthorized',
    message: 'You must be logged in to perform this action',
  };
}
