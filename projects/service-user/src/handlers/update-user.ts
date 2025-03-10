import { TRPCError } from '@trpc/server';
import * as schema from '@vers/postgres-schema';
import { UpdateUserPayload } from '@vers/service-types';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import type { Context } from '../types';
import { t } from '../t';

export const UpdateUserInputSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  username: z.string().optional(),
});

export async function updateUser(
  input: z.infer<typeof UpdateUserInputSchema>,
  ctx: Context,
): Promise<UpdateUserPayload> {
  try {
    const { id, ...update } = input;

    const [user] = await ctx.db
      .update(schema.users)
      .set({
        ...update,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, id))
      .returning({
        updatedID: schema.users.id,
      });

    return { updatedID: user.updatedID };
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    throw new TRPCError({
      cause: error,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unknown error occurred',
    });
  }
}

export const procedure = t.procedure
  .input(UpdateUserInputSchema)
  .mutation(async ({ ctx, input }) => updateUser(input, ctx));
