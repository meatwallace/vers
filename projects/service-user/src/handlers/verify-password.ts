import { TRPCError } from '@trpc/server';
import * as schema from '@vers/postgres-schema';
import { VerifyPasswordPayload } from '@vers/service-types';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import type { Context } from '../types';
import { t } from '../t';

export const VerifyPasswordInputSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function verifyPassword(
  input: z.infer<typeof VerifyPasswordInputSchema>,
  ctx: Context,
): Promise<VerifyPasswordPayload> {
  try {
    const user = await ctx.db.query.users.findFirst({
      where: eq(schema.users.email, input.email),
    });

    if (!user) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No user with that email',
      });
    }

    if (!user.passwordHash) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User does not have a password set',
      });
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);

    if (!isValid) {
      return { success: false };
    }

    return { success: true };
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
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
  .input(VerifyPasswordInputSchema)
  .mutation(async ({ ctx, input }) => verifyPassword(input, ctx));
