import * as schema from '@vers/postgres-schema';

export type VerificationType =
  (typeof schema.verifications.$inferSelect)['type'];

interface VerificationData {
  id: string;
  target: string;
  type: VerificationType;
}

export interface CreateVerificationArgs {
  expiresAt?: Date | null;
  period?: number;
  target: string;
  type: VerificationType;
}

export type CreateVerificationPayload = VerificationData & { otp: string };

export interface VerifyCodeArgs {
  code: string;
  target: string;
  type: VerificationType;
}

export type VerifyCodePayload = null | VerificationData;

export interface GetVerificationArgs {
  target: string;
  type: VerificationType;
}

export type GetVerificationPayload = null | VerificationData;

export interface UpdateVerificationArgs {
  id: string;
  type?: VerificationType;
}

export interface UpdateVerificationPayload {
  updatedID: string;
}

export interface DeleteVerificationArgs {
  id: string;
}

export interface DeleteVerificationPayload {
  deletedID: string;
}

export interface Get2FAVerificationURIArgs {
  target: string;
}

export interface Get2FAVerificationURIPayload {
  otpURI: string;
}
