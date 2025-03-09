import * as schema from '@vers/postgres-schema';
import {
  RefreshTokensRequest,
  RefreshTokensResponse,
} from '@vers/service-types';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';
import * as consts from '../consts';
import { createJWT } from '../utils/create-jwt';

export async function refreshTokens(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const body = await ctx.req.json<RefreshTokensRequest>();

    const existingSession = await db.query.sessions.findFirst({
      where: eq(schema.sessions.refreshToken, body.refreshToken),
    });

    if (!existingSession) {
      return ctx.json({
        error: 'Invalid refresh token',
        success: false,
      });
    }

    // Check if the session has expired
    if (existingSession.expiresAt < new Date()) {
      await db
        .delete(schema.sessions)
        .where(eq(schema.sessions.id, existingSession.id));

      return ctx.json({
        error: 'Session expired',
        success: false,
      });
    }

    const now = Date.now();
    const sessionAge = now - existingSession.createdAt.getTime();

    // if our session has existed for less than our short refresh token duration,
    // we can just create a new access token and skip rotating the refresh token
    if (sessionAge < consts.REFRESH_TOKEN_DURATION) {
      const accessToken = await createJWT({
        expiresAt: new Date(Date.now() + consts.ACCESS_TOKEN_DURATION),
        userID: existingSession.userID,
      });

      const data = {
        ...existingSession,
        accessToken,
      };

      return ctx.json({ data, success: true });
    }

    // generate a new refresh token so we can rotate it, using the same expiry as before
    const refreshToken = await createJWT({
      expiresAt: existingSession.expiresAt,
      userID: existingSession.userID,
    });

    const accessToken = await createJWT({
      expiresAt: new Date(Date.now() + consts.ACCESS_TOKEN_DURATION),
      userID: existingSession.userID,
    });

    const updatedAt = new Date();

    await db
      .update(schema.sessions)
      .set({
        refreshToken,
        updatedAt,
      })
      .where(eq(schema.sessions.id, existingSession.id));

    const response: RefreshTokensResponse = {
      data: {
        ...existingSession,
        accessToken,
        refreshToken,
        updatedAt,
      },
      success: true,
    };

    return ctx.json(response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      const response = {
        error: 'An unknown error occurred',
        success: false,
      };

      return ctx.json(response);
    }

    throw error;
  }
}
