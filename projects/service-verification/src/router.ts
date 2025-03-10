import { procedure as createVerificationProcedure } from './handlers/create-verification';
import { procedure as deleteVerificationProcedure } from './handlers/delete-verification';
import { procedure as get2FAVerificationURIProcedure } from './handlers/get-2fa-verification-uri';
import { procedure as getVerificationProcedure } from './handlers/get-verification';
import { procedure as updateVerificationProcedure } from './handlers/update-verification';
import { procedure as verifyCodeProcedure } from './handlers/verify-code';
import { t } from './t';

export const router = t.router({
  createVerification: createVerificationProcedure,
  deleteVerification: deleteVerificationProcedure,
  get2FAVerificationURI: get2FAVerificationURIProcedure,
  getVerification: getVerificationProcedure,
  updateVerification: updateVerificationProcedure,
  verifyCode: verifyCodeProcedure,
});
