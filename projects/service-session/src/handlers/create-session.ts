import * as schema from '@chrono/postgres-schema';
import {
  CreateSessionRequest,
  CreateSessionResponse,
} from '@chrono/service-types';
import { createId } from '@paralleldrive/cuid2';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';
import * as consts from '../consts';
import { createJWT } from '../utils/create-jwt';

export async function createSession(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { expiresAt, ipAddress, rememberMe, userID } =
      await ctx.req.json<CreateSessionRequest>();

    const refreshTokenDuration = rememberMe
      ? consts.REFRESH_TOKEN_DURATION_LONG
      : consts.REFRESH_TOKEN_DURATION;

    const refreshTokenExpiresAt = expiresAt
      ? new Date(expiresAt)
      : new Date(Date.now() + refreshTokenDuration);

    const refreshToken = await createJWT({
      expiresAt: refreshTokenExpiresAt,
      userID,
    });

    const accessToken = await createJWT({
      expiresAt: new Date(Date.now() + consts.ACCESS_TOKEN_DURATION),
      userID,
    });

    const session: typeof schema.sessions.$inferSelect = {
      createdAt: new Date(),
      expiresAt: refreshTokenExpiresAt,
      id: createId(),
      ipAddress,
      refreshToken,
      updatedAt: new Date(),
      userID,
    };

    await db.insert(schema.sessions).values(session);

    const response: CreateSessionResponse = {
      data: {
        ...session,
        accessToken,
      },
      success: true,
    };

    return ctx.json(response);
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
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
