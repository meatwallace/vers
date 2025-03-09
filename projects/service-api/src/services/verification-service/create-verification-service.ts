import { createServiceContext } from '../utils/create-service-context';
import { CreateServiceContextConfig } from '../utils/types';
import { createVerification } from './create-verification';
import { deleteVerification } from './delete-verification';
import { get2FAVerificationURI } from './get-2fa-verification-uri';
import { getVerification } from './get-verification';
import { VerificationService } from './types';
import { updateVerification } from './update-verification';
import { verifyCode } from './verify-code';

type VerificationServiceConfig = CreateServiceContextConfig;

export function createVerificationService(
  config: VerificationServiceConfig,
): VerificationService {
  const ctx = createServiceContext(config);

  return {
    createVerification: (args) => createVerification(args, ctx),
    deleteVerification: (args) => deleteVerification(args, ctx),
    get2FAVerificationURI: (args) => get2FAVerificationURI(args, ctx),
    getVerification: (args) => getVerification(args, ctx),
    updateVerification: (args) => updateVerification(args, ctx),
    verifyCode: (args) => verifyCode(args, ctx),
  };
}
