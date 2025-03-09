import { Context } from 'hono';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '@chrono/service-types';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import * as schema from '@chrono/postgres-schema';
import { hashPassword } from '@chrono/service-utils';
import { logger } from '../logger';

const log = logger.child({ module: 'changePassword' });

export async function changePassword(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { id, password, resetToken } =
      await ctx.req.json<ChangePasswordRequest>();

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });

    if (!user) {
      return ctx.json({
        success: false,
        error: 'User not found',
      });
    }

    const isTokenMismatch = user.passwordResetToken !== resetToken;

    if (isTokenMismatch) {
      return ctx.json({
        success: false,
        error: 'Invalid reset token',
      });
    }

    const isTokenExpired =
      user.passwordResetTokenExpiresAt &&
      user.passwordResetTokenExpiresAt < new Date();

    if (isTokenExpired) {
      return ctx.json({
        success: false,
        error: 'Reset token expired',
      });
    }

    const passwordHash = await hashPassword(password);

    await db.transaction(async (tx) => {
      // delete all sessions for this user
      await tx.delete(schema.sessions).where(eq(schema.sessions.userID, id));

      // update the user's password
      const [updatedUser] = await tx
        .update(schema.users)
        .set({
          passwordHash,
          passwordResetToken: null,
          passwordResetTokenExpiresAt: null,
          updatedAt: new Date(),
        })
        .where(eq(schema.users.id, id))
        .returning();

      return [updatedUser];
    });

    const response: ChangePasswordResponse = {
      success: true,
      data: {},
    };

    return ctx.json(response);
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    log.error('unknown error');
    log.error(error);

    if (error instanceof Error) {
      return ctx.json({
        success: false,
        error: 'An unknown error occurred',
      });
    }

    throw error;
  }
}
