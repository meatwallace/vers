import {
  CreateVerificationRequest,
  DeleteVerificationRequest,
  Get2FAVerificationURIRequest,
  GetVerificationRequest,
  UpdateVerificationRequest,
  VerifyCodeRequest,
} from '@vers/service-types';
import { ServiceContext } from '../utils/types';

export type VerificationServiceContext = ServiceContext;

export interface VerificationPayload {
  code: string;
  verification: VerificationData;
}

export interface VerificationData {
  id: string;
  target: string;
  type: string;
}

export interface VerificationService {
  createVerification: (
    args: CreateVerificationRequest,
  ) => Promise<VerificationPayload>;

  deleteVerification: (args: DeleteVerificationRequest) => Promise<true>;

  get2FAVerificationURI: (
    args: Get2FAVerificationURIRequest,
  ) => Promise<string>;

  getVerification: (
    args: GetVerificationRequest,
  ) => Promise<null | VerificationData>;

  updateVerification: (
    args: UpdateVerificationRequest,
  ) => Promise<{ success: boolean }>;

  verifyCode: (args: VerifyCodeRequest) => Promise<null | VerificationData>;
}
