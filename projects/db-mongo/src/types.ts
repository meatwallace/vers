export type ReplicaSetRole = 'non-initialized' | 'primary' | 'secondary';

export interface CheckSuccessPayload {
  [key: string]: unknown;
  check: string;
}

export interface CheckErrorPayload {
  check: string;
  error: string;
}

export type CheckPayload = CheckErrorPayload | CheckSuccessPayload;
