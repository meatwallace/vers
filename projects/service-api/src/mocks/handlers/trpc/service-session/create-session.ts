import { db } from '../../../db';
import { trpc } from './trpc';

const EXPIRES_AT_OFFSET = 1000 * 60 * 60 * 24 * 1;
const EXPIRES_AT_REMEMBER_ME_OFFSET = 1000 * 60 * 60 * 24 * 30;

export const createSession = trpc.createSession.mutation(({ input }) => {
  const expiryOffset = input.rememberMe
    ? EXPIRES_AT_REMEMBER_ME_OFFSET
    : EXPIRES_AT_OFFSET;

  const expiresAt = input.expiresAt
    ? new Date(input.expiresAt)
    : new Date(Date.now() + expiryOffset);

  const session = db.session.create({
    expiresAt,
    ipAddress: input.ipAddress,
    refreshToken: null,
    userID: input.userID,
    verified: false,
  });

  return session;
});
