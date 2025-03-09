import * as schema from '@vers/postgres-schema';
import {
  VerifyPasswordRequest,
  VerifyPasswordResponse,
} from '@vers/service-types';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';

export async function verifyPassword(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { email, password } = await ctx.req.json<VerifyPasswordRequest>();

    const user = await db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (!user) {
      const response: VerifyPasswordResponse = {
        error: 'No user with that email',
        success: false,
      };

      return ctx.json(response);
    }

    if (!user.passwordHash) {
      const response: VerifyPasswordResponse = {
        error: 'User does not have a password set',
        success: false,
      };

      return ctx.json(response);
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      const response: VerifyPasswordResponse = {
        error: 'Incorrect password',
        success: false,
      };

      return ctx.json(response);
    }

    const response: VerifyPasswordResponse = {
      data: {},
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
