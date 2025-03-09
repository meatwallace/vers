import * as schema from '@chrono/postgres-schema';
import {
  CreatePasswordResetTokenRequest,
  CreatePasswordResetTokenResponse,
} from '@chrono/service-types';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';
import { randomBytes } from 'node:crypto';
import { promisify } from 'node:util';

const randomBytesAsync = promisify(randomBytes);

export async function createPasswordResetToken(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { id } = await ctx.req.json<CreatePasswordResetTokenRequest>();

    const user = await db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });

    if (!user) {
      return ctx.json({
        error: 'User not found',
        success: false,
      });
    }

    if (!user.passwordHash) {
      return ctx.json({
        error: 'User has no password',
        success: false,
      });
    }

    const tokenBytes = await randomBytesAsync(32);
    const resetToken = tokenBytes.toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // intentionally not updating our user record's `updatedAt` field
    // so that it's reflective of information that matters to the user
    await db
      .update(schema.users)
      .set({
        passwordResetToken: resetToken,
        passwordResetTokenExpiresAt: expiresAt,
      })
      .where(eq(schema.users.id, id));

    const response: CreatePasswordResetTokenResponse = {
      data: {
        resetToken,
      },
      success: true,
    };

    return ctx.json(response);
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    if (error instanceof Error) {
      return ctx.json({
        error: 'An unknown error occurred',
        success: false,
      });
    }

    throw error;
  }
}
