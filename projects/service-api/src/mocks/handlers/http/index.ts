import { sendEmail } from '../service-email/send-email';
import { createSession } from '../service-session/create-session';
import { deleteSession } from '../service-session/delete-session';
import { getSession } from '../service-session/get-session';
import { getSessions } from '../service-session/get-sessions';
import { refreshTokens } from '../service-session/refresh-tokens';
import { changePassword } from '../service-user/change-password';
import { createPasswordResetToken } from '../service-user/create-password-reset-token';
import { createUser } from '../service-user/create-user';
import { getUser } from '../service-user/get-user';
import { verifyPassword } from '../service-user/verify-password';

export const handlers = [
  // email
  sendEmail,

  // sessions
  createSession,
  deleteSession,
  getSession,
  getSessions,
  refreshTokens,

  // users
  changePassword,
  createPasswordResetToken,
  createUser,
  getUser,
  verifyPassword,
];
