export interface MutationError {
  error: { message: string; title: string };
}

export type MutationResponse<T> = { [key in keyof T]: MutationError } | T;
