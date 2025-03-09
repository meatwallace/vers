import type {
  CreateUserRequest,
  CreateUserResponse,
} from '@chrono/service-types';
import * as schema from '@chrono/postgres-schema';
import { hashPassword, isUniqueConstraintError } from '@chrono/service-utils';
import { createId } from '@paralleldrive/cuid2';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { Context } from 'hono';
import * as pg from 'postgres';

export async function createUser(
  ctx: Context,
  db: PostgresJsDatabase<typeof schema>,
) {
  try {
    const { email, name, password, username } =
      await ctx.req.json<CreateUserRequest>();

    const createdAt = new Date();
    const passwordHash = await hashPassword(password);

    const user: typeof schema.users.$inferSelect = {
      createdAt,
      email,
      id: createId(),
      name,
      passwordHash,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
      updatedAt: createdAt,
      username,
    };

    await db.insert(schema.users).values(user);

    const response: CreateUserResponse = {
      data: {
        createdAt: user.createdAt,
        email: user.email,
        id: user.id,
        name: user.name,
        updatedAt: user.updatedAt,
        username: user.username,
      },
      success: true,
    };

    return ctx.json(response);
  } catch (error: unknown) {
    if (error instanceof pg.PostgresError) {
      if (isUniqueConstraintError(error, 'users_email_unique')) {
        const response = {
          error: 'A user with that email already exists',
          success: false,
        };

        return ctx.json(response);
      }

      if (isUniqueConstraintError(error, 'users_username_unique')) {
        const response = {
          error: 'A user with that username already exists',
          success: false,
        };

        return ctx.json(response);
      }
    }

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
