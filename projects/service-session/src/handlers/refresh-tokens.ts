import { TRPCError } from '@trpc/server';
import * as schema from '@vers/postgres-schema';
import { RefreshTokensPayload } from '@vers/service-types';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import type { Context } from '../types';
import * as consts from '../consts';
import { logger } from '../logger';
import { t } from '../t';
import { createJWT } from '../utils/create-jwt';

export const RefreshTokensInputSchema = z.object({
  refreshToken: z.string(),
});

export async function refreshTokens(
  input: z.infer<typeof RefreshTokensInputSchema>,
  ctx: Context,
): Promise<RefreshTokensPayload> {
  try {
    const existingSession = await ctx.db.query.sessions.findFirst({
      where: eq(schema.sessions.refreshToken, input.refreshToken),
    });

    if (!existingSession) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Invalid refresh token',
      });
    }

    const { refreshToken, ...session } = existingSession;

    // Check if the session has expired
    if (session.expiresAt < new Date()) {
      await ctx.db
        .delete(schema.sessions)
        .where(eq(schema.sessions.id, session.id));

      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Session expired',
      });
    }

    const now = Date.now();
    const sessionAge = now - session.createdAt.getTime();

    // if our session has existed for less than our short refresh token duration,
    // we can just create a new access token and skip rotating the refresh token
    if (sessionAge < consts.REFRESH_TOKEN_DURATION) {
      const accessToken = await createJWT({
        expiresAt: new Date(Date.now() + consts.ACCESS_TOKEN_DURATION),
        userID: session.userID,
      });

      return {
        accessToken,
        refreshToken,
        session,
      };
    }

    // generate a new refresh token so we can rotate it, using the same expiry as before
    const newRefreshToken = await createJWT({
      expiresAt: existingSession.expiresAt,
      userID: existingSession.userID,
    });

    const accessToken = await createJWT({
      expiresAt: new Date(Date.now() + consts.ACCESS_TOKEN_DURATION),
      userID: existingSession.userID,
    });

    const updatedAt = new Date();

    await ctx.db
      .update(schema.sessions)
      .set({
        refreshToken: newRefreshToken,
        updatedAt,
      })
      .where(eq(schema.sessions.id, existingSession.id));

    return {
      accessToken,
      refreshToken: newRefreshToken,
      session,
    };
  } catch (error: unknown) {
    logger.error(error);

    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      cause: error,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unknown error occurred',
    });
  }
}

export const procedure = t.procedure
  .input(RefreshTokensInputSchema)
  .mutation(async ({ ctx, input }) => refreshTokens(input, ctx));
