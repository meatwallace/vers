import { createVerification } from './create-verification';
import { verifyCode } from './verify-code';
import { VerificationService } from './types';
import { CreateServiceContextConfig } from '../utils/types';
import { createServiceContext } from '../utils/create-service-context';

type VerificationServiceConfig = CreateServiceContextConfig;

export function createVerificationService(
  config: VerificationServiceConfig,
): VerificationService {
  const ctx = createServiceContext(config);

  return {
    createVerification: (args) => createVerification(args, ctx),
    verifyCode: (args) => verifyCode(args, ctx),
  };
}
