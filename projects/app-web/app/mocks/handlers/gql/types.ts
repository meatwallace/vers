export interface MutationError {
  error: { title: string; message: string };
}

export type MutationResponse<T> = T | { [key in keyof T]: MutationError };
