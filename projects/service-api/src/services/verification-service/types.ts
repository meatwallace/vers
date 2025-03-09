import {
  CreateVerificationRequest,
  DeleteVerificationRequest,
  Get2FAVerificationURIRequest,
  GetVerificationRequest,
  UpdateVerificationRequest,
  VerifyCodeRequest,
} from '@chrono/service-types';
import { ServiceContext } from '../utils/types';

export type VerificationServiceContext = ServiceContext;

export interface VerificationPayload {
  code: string;
  verification: VerificationData;
}

export interface VerificationData {
  id: string;
  type: string;
  target: string;
}

export interface VerificationService {
  createVerification: (
    args: CreateVerificationRequest,
  ) => Promise<VerificationPayload>;

  getVerification: (
    args: GetVerificationRequest,
  ) => Promise<VerificationData | null>;

  updateVerification: (
    args: UpdateVerificationRequest,
  ) => Promise<{ success: boolean }>;

  deleteVerification: (args: DeleteVerificationRequest) => Promise<true>;

  verifyCode: (args: VerifyCodeRequest) => Promise<VerificationData | null>;

  get2FAVerificationURI: (
    args: Get2FAVerificationURIRequest,
  ) => Promise<string>;
}
