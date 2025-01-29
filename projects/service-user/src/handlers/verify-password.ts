import bcrypt from 'bcryptjs';
import { Context } from 'hono';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import * as schema from '@chrono/postgres-schema';
import {
  VerifyPasswordRequest,
  VerifyPasswordResponse,
} from '@chrono/service-types';

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
        success: false,
        error: 'No user with that email',
      };

      return ctx.json(response);
    }

    if (!user.passwordHash) {
      const response: VerifyPasswordResponse = {
        success: false,
        error: 'User does not have a password set',
      };

      return ctx.json(response);
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      const response: VerifyPasswordResponse = {
        success: false,
        error: 'Incorrect password',
      };

      return ctx.json(response);
    }

    const response: VerifyPasswordResponse = {
      success: true,
      data: {},
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
