import * as schema from '@chrono/postgres-schema';
import { ServiceResponse } from './service-response';

type Verification = typeof schema.verifications.$inferSelect;

export type CreateVerificationRequest = {
  type: Verification['type'];
  target: string;
  period: number;
};

export type CreateVerificationResponse = ServiceResponse<{
  id: string;
  type: Verification['type'];
  target: string;
  otp: string;
}>;

export type VerifyCodeRequest = {
  type: Verification['type'];
  target: string;
  code: string;
};

export type VerifyCodeResponse = ServiceResponse<{
  id: string;
  type: Verification['type'];
  target: string;
}>;
