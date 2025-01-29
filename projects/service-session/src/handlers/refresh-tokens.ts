import { Context } from 'hono';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import * as schema from '@chrono/postgres-schema';
import {
  RefreshTokensRequest,
  RefreshTokensResponse,
} from '@chrono/service-types';
import { createJWT } from '../utils/create-jwt';
import * as consts from '../consts';

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
        success: false,
        error: 'Invalid refresh token',
      });
    }

    // Check if the session has expired
    if (existingSession.expiresAt < new Date()) {
      await db
        .delete(schema.sessions)
        .where(eq(schema.sessions.id, existingSession.id));

      return ctx.json({
        success: false,
        error: 'Session expired',
      });
    }

    const now = Date.now();
    const sessionAge = now - existingSession.createdAt.getTime();

    // if our session has existed for less than our short refresh token duration,
    // we can just create a new access token and skip rotating the refresh token
    if (sessionAge < consts.REFRESH_TOKEN_DURATION) {
      const accessToken = await createJWT({
        userID: existingSession.userID,
        expiresAt: new Date(Date.now() + consts.ACCESS_TOKEN_DURATION),
      });

      const data = {
        ...existingSession,
        accessToken,
      };

      return ctx.json({ success: true, data });
    }

    // generate a new refresh token so we can rotate it, using the same expiry as before
    const refreshToken = await createJWT({
      userID: existingSession.userID,
      expiresAt: existingSession.expiresAt,
    });

    const accessToken = await createJWT({
      userID: existingSession.userID,
      expiresAt: new Date(Date.now() + consts.ACCESS_TOKEN_DURATION),
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
      success: true,
      data: {
        ...existingSession,
        refreshToken,
        accessToken,
        updatedAt,
      },
    };

    return ctx.json(response);
  } catch (error: unknown) {
    if (error instanceof Error) {
      const response = {
        success: false,
        error: 'An unknown error occurred',
      };

      return ctx.json(response);
    }

    throw error;
  }
}
