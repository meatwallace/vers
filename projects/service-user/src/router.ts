import { procedure as changePasswordProcedure } from './handlers/change-password';
import { procedure as createPasswordResetTokenProcedure } from './handlers/create-password-reset-token';
import { procedure as createUserProcedure } from './handlers/create-user';
import { procedure as getUserProcedure } from './handlers/get-user';
import { procedure as resetPasswordProcedure } from './handlers/reset-password';
import { procedure as updateUserProcedure } from './handlers/update-user';
import { procedure as verifyPasswordProcedure } from './handlers/verify-password';
import { t } from './t';

export const router = t.router({
  changePassword: changePasswordProcedure,
  createPasswordResetToken: createPasswordResetTokenProcedure,
  createUser: createUserProcedure,
  getUser: getUserProcedure,
  resetPassword: resetPasswordProcedure,
  updateUser: updateUserProcedure,
  verifyPassword: verifyPasswordProcedure,
});
