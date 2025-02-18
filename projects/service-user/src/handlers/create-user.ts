import * as pg from 'postgres';
import * as schema from '@chrono/postgres-schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';
import { createId } from '@paralleldrive/cuid2';
import { isUniqueConstraintError, hashPassword } from '@chrono/service-utils';
import type {
  CreateUserRequest,
  CreateUserResponse,
} from '@chrono/service-types';

export async function createUser(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { email, name, username, password } =
      await ctx.req.json<CreateUserRequest>();

    const createdAt = new Date();
    const passwordHash = await hashPassword(password);

    const user: typeof schema.users.$inferSelect = {
      id: createId(),
      email,
      name,
      username,
      passwordHash,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
      createdAt,
      updatedAt: createdAt,
    };

    await db.insert(schema.users).values(user);

    const response: CreateUserResponse = {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };

    return ctx.json(response);
  } catch (error: unknown) {
    if (error instanceof pg.PostgresError) {
      if (isUniqueConstraintError(error, 'users_email_unique')) {
        const response = {
          success: false,
          error: 'A user with that email already exists',
        };

        return ctx.json(response);
      }

      if (isUniqueConstraintError(error, 'users_username_unique')) {
        const response = {
          success: false,
          error: 'A user with that username already exists',
        };

        return ctx.json(response);
      }
    }

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
