import {
  CreateVerificationRequest,
  VerifyCodeRequest,
} from '@chrono/service-types';
import { ServiceContext } from '../utils/types';

export type VerificationServiceContext = ServiceContext;

export type VerificationPayload = {
  code: string;
  verification: VerificationData;
};

export type VerificationData = {
  id: string;
  type: string;
  target: string;
};

export type VerificationService = {
  createVerification: (
    args: CreateVerificationRequest,
  ) => Promise<VerificationPayload>;

  verifyCode: (args: VerifyCodeRequest) => Promise<VerificationData | null>;
};
