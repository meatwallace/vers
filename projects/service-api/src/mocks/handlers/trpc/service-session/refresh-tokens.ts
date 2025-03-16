import { TRPCError } from '@trpc/server';
import { RefreshTokensPayload } from '@vers/service-types';
import { db } from '../../../db';
import { trpc } from './trpc';

export const refreshTokens = trpc.refreshTokens.mutation(({ input }) => {
  const session = db.session.findFirst({
    where: { refreshToken: { equals: input.refreshToken } },
  });

  if (!session) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Session not found',
    });
  }

  const { refreshToken: oldRefreshToken, ...sessionData } = session;

  const newRefreshToken = `refresh_token_${Date.now()}`;

  db.session.update({
    data: { refreshToken: newRefreshToken },
    where: { id: { equals: session.id } },
  });

  const result: RefreshTokensPayload = {
    accessToken: `access_token_${Date.now()}`,
    refreshToken: newRefreshToken,
    session: sessionData,
  };

  return result;
});
