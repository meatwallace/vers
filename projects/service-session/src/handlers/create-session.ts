import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';
import * as schema from '@chrono/postgres-schema';
import {
  CreateSessionRequest,
  CreateSessionResponse,
} from '@chrono/service-types';
import { createId } from '@paralleldrive/cuid2';
import * as consts from '../consts';
import { createJWT } from '../utils/create-jwt';

export async function createSession(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { userID, ipAddress, rememberMe, expiresAt } =
      await ctx.req.json<CreateSessionRequest>();

    const refreshTokenDuration = rememberMe
      ? consts.REFRESH_TOKEN_DURATION_LONG
      : consts.REFRESH_TOKEN_DURATION;

    const refreshTokenExpiresAt = expiresAt
      ? new Date(expiresAt)
      : new Date(Date.now() + refreshTokenDuration);

    const refreshToken = await createJWT({
      userID,
      expiresAt: refreshTokenExpiresAt,
    });

    const accessToken = await createJWT({
      userID,
      expiresAt: new Date(Date.now() + consts.ACCESS_TOKEN_DURATION),
    });

    const session: typeof schema.sessions.$inferSelect = {
      id: createId(),
      refreshToken,
      expiresAt: refreshTokenExpiresAt,
      ipAddress,
      userID,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(schema.sessions).values(session);

    const response: CreateSessionResponse = {
      success: true,
      data: {
        ...session,
        accessToken,
      },
    };

    return ctx.json(response);
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
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
