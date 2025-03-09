import * as schema from '@chrono/postgres-schema';
import { ServiceResponse } from './service-response';

export type VerificationType =
  (typeof schema.verifications.$inferSelect)['type'];

interface VerificationData {
  id: string;
  type: VerificationType;
  target: string;
}

export interface CreateVerificationRequest {
  type: VerificationType;
  target: string;
  period?: number;
  expiresAt?: Date | null;
}

export type CreateVerificationResponse = ServiceResponse<
  VerificationData & { otp: string }
>;

export interface VerifyCodeRequest {
  type: VerificationType;
  target: string;
  code: string;
}

export type VerifyCodeResponse = ServiceResponse<VerificationData>;

export interface GetVerificationRequest {
  type: VerificationType;
  target: string;
}

export type GetVerificationResponse = ServiceResponse<VerificationData | null>;

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
