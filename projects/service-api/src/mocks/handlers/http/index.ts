import { changePassword } from './change-password';
import { CreatePasswordResetToken } from './create-password-reset-token';
import { createSession } from './create-session';
import { createUser } from './create-user';
import { createVerification } from './create-verification';
import { createWorld } from './create-world';
import { deleteSession } from './delete-session';
import { deleteWorld } from './delete-world';
import { generateWorldNames } from './generate-world-names';
import { getSessions } from './get-sessions';
import { getUser } from './get-user';
import { getWorld } from './get-world';
import { getWorlds } from './get-worlds';
import { refreshTokens } from './refresh-tokens';
import { sendEmail } from './send-email';
import { updateWorld } from './update-world';
import { verifyCode } from './verify-code';
import { verifyPassword } from './verify-password';

export const handlers = [
  // email
  sendEmail,

  // sessions
  createSession,
  deleteSession,
  getSessions,
  refreshTokens,

  // users
  changePassword,
  CreatePasswordResetToken,
  createUser,
  getUser,
  verifyPassword,

  // worlds
  createWorld,
  deleteWorld,
  getWorld,
  getWorlds,
  updateWorld,
  generateWorldNames,

  // verifications
  createVerification,
  verifyCode,
];
