import { TRPCError } from '@trpc/server';
import * as schema from '@vers/postgres-schema';
import { UpdateAvatarPayload } from '@vers/service-types';
import { AvatarNameSchema } from '@vers/validation';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { logger } from '~/logger';
import type { Context } from '../types';
import { t } from '../t';

const UpdateAvatarInputSchema = z.object({
  id: z.string(),
  name: AvatarNameSchema,
  userID: z.string(),
});

async function updateAvatar(
  input: z.infer<typeof UpdateAvatarInputSchema>,
  ctx: Context,
): Promise<UpdateAvatarPayload> {
  try {
    const [avatar] = await ctx.db
      .update(schema.avatars)
      .set({
        name: input.name,
        updatedAt: new Date(),
      })
      .where(eq(schema.avatars.id, input.id))
      .returning({
        updatedID: schema.avatars.id,
      });

    if (!avatar) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Avatar not found',
      });
    }

    return { updatedID: avatar.updatedID };
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
  .input(UpdateAvatarInputSchema)
  .mutation(async ({ ctx, input }) => updateAvatar(input, ctx));
