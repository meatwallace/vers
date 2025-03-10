import { sendEmail } from './service-email/send-email';
import { createSession } from './service-session/create-session';
import { deleteSession } from './service-session/delete-session';
import { getSession } from './service-session/get-session';
import { getSessions } from './service-session/get-sessions';
import { refreshTokens } from './service-session/refresh-tokens';
import { changePassword } from './service-user/change-password';
import { createPasswordResetToken } from './service-user/create-password-reset-token';
import { createUser } from './service-user/create-user';
import { getUser } from './service-user/get-user';
import { verifyPassword } from './service-user/verify-password';
import { createVerification } from './service-verification/create-verification';
import { deleteVerification } from './service-verification/delete-verification';
import { get2FAVerificationURI } from './service-verification/get-2fa-verification-uri';
import { getVerification } from './service-verification/get-verification';
import { updateVerification } from './service-verification/update-verification';
import { verifyCode } from './service-verification/verify-code';

export const handlers = [
  // service-email
  sendEmail,

  // service-session
  createSession,
  deleteSession,
  getSession,
  getSessions,
  refreshTokens,

  // service-user
  changePassword,
  createPasswordResetToken,
  createUser,
  getUser,
  verifyPassword,

  // service-verification
  createVerification,
  deleteVerification,
  get2FAVerificationURI,
  getVerification,
  updateVerification,
  verifyCode,
];
