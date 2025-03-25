import { TRPCError } from '@trpc/server';
import * as schema from '@vers/postgres-schema';
import { ChangePasswordPayload } from '@vers/service-types';
import { hashPassword } from '@vers/service-utils';
import { eq } from 'drizzle-orm';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { logger } from '~/logger';
import type { Context } from '../types';
import { t } from '../t';

export const ChangePasswordInputSchema = z.object({
  id: z.string(),
  password: z.string(),
});

export async function changePassword(
  input: z.infer<typeof ChangePasswordInputSchema>,
  ctx: Context,
): Promise<ChangePasswordPayload> {
  try {
    const { id, password } = input;

    const user = await ctx.db.query.users.findFirst({
      where: eq(schema.users.id, id),
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }

    const passwordHash = await hashPassword(password);

    const [updatedUser] = await ctx.db
      .update(schema.users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, id))
      .returning({
        updatedID: schema.users.id,
      });

    invariant(updatedUser, 'user must be found');

    return { updatedID: updatedUser.updatedID };
  } catch (error: unknown) {
    logger.error(error);

    if (error instanceof TRPCError) {
      throw error;
    }

    throw new TRPCError({
      cause: error,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unknown error occurred',
    });
  }
}

export const procedure = t.procedure
  .input(ChangePasswordInputSchema)
  .mutation(async ({ ctx, input }) => changePassword(input, ctx));
