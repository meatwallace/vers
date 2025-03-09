export interface MutationError {
  error: { message: string; title: string };
}

export type MutationResponse<T> = T | { [key in keyof T]: MutationError };
