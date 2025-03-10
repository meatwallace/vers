import { createId } from '@paralleldrive/cuid2';
import { TRPCError } from '@trpc/server';
import * as schema from '@vers/postgres-schema';
import { CreateUserPayload } from '@vers/service-types';
import { hashPassword, isUniqueConstraintError } from '@vers/service-utils';
import * as pg from 'postgres';
import { z } from 'zod';
import type { Context } from '../types';
import { t } from '../t';

export const CreateUserInputSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  username: z.string(),
});

export async function createUser(
  input: z.infer<typeof CreateUserInputSchema>,
  ctx: Context,
): Promise<CreateUserPayload> {
  try {
    const { email, name, password, username } = input;

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

    await ctx.db.insert(schema.users).values(user);

    return {
      createdAt: user.createdAt,
      email: user.email,
      id: user.id,
      name: user.name,
      updatedAt: user.updatedAt,
      username: user.username,
    };
  } catch (error: unknown) {
    if (error instanceof pg.PostgresError) {
      if (isUniqueConstraintError(error, 'users_email_unique')) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A user with that email already exists',
        });
      }

      if (isUniqueConstraintError(error, 'users_username_unique')) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A user with that username already exists',
        });
      }
    }

    // TODO(#16): capture via Sentry
    throw new TRPCError({
      cause: error,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unknown error occurred',
    });
  }
}

export const procedure = t.procedure
  .input(CreateUserInputSchema)
  .mutation(async ({ ctx, input }) => createUser(input, ctx));
