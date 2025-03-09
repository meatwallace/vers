import * as schema from '@chrono/postgres-schema';
import { ServiceResponse } from './service-response';

export type VerificationType =
  (typeof schema.verifications.$inferSelect)['type'];

interface VerificationData {
  id: string;
  target: string;
  type: VerificationType;
}

export interface CreateVerificationRequest {
  expiresAt?: Date | null;
  period?: number;
  target: string;
  type: VerificationType;
}

export type CreateVerificationResponse = ServiceResponse<
  VerificationData & { otp: string }
>;

export interface VerifyCodeRequest {
  code: string;
  target: string;
  type: VerificationType;
}

export type VerifyCodeResponse = ServiceResponse<VerificationData>;

export interface GetVerificationRequest {
  target: string;
  type: VerificationType;
}

export type GetVerificationResponse = ServiceResponse<null | VerificationData>;

export interface UpdateVerificationRequest {
  id: string;
  type?: VerificationType;
}

export type UpdateVerificationResponse = ServiceResponse<{
  updatedID: string;
}>;

export interface DeleteVerificationRequest {
  id: string;
}

export type DeleteVerificationResponse = ServiceResponse<{ deletedID: string }>;

export interface Get2FAVerificationURIRequest {
  target: string;
}

export type Get2FAVerificationURIResponse = ServiceResponse<{
  otpURI: string;
}>;
