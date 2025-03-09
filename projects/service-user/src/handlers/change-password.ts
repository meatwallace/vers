import * as schema from '@vers/postgres-schema';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
} from '@vers/service-types';
import { hashPassword } from '@vers/service-utils';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';
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
        error: 'User not found',
        success: false,
      });
    }

    const isTokenMismatch = user.passwordResetToken !== resetToken;

    if (isTokenMismatch) {
      return ctx.json({
        error: 'Invalid reset token',
        success: false,
      });
    }

    const isTokenExpired =
      user.passwordResetTokenExpiresAt &&
      user.passwordResetTokenExpiresAt < new Date();

    if (isTokenExpired) {
      return ctx.json({
        error: 'Reset token expired',
        success: false,
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
      data: {},
      success: true,
    };

    return ctx.json(response);
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    log.error('unknown error');
    log.error(error);

    if (error instanceof Error) {
      return ctx.json({
        error: 'An unknown error occurred',
        success: false,
      });
    }

    throw error;
  }
}
