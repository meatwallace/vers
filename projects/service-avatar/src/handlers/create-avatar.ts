import type { CreateAvatarPayload } from '@vers/service-types';
import { createId } from '@paralleldrive/cuid2';
import { TRPCError } from '@trpc/server';
import { Class } from '@vers/data';
import * as schema from '@vers/postgres-schema';
import { isPGError, isUniqueConstraintError } from '@vers/service-utils';
import { AvatarNameSchema } from '@vers/validation';
import { z } from 'zod';
import { logger } from '~/logger';
import type { Context } from '../types';
import { t } from '../t';

const CreateAvatarInputSchema = z.object({
  class: z.nativeEnum(Class),
  name: AvatarNameSchema,
  userID: z.string(),
});

async function createAvatar(
  input: z.infer<typeof CreateAvatarInputSchema>,
  ctx: Context,
): Promise<CreateAvatarPayload> {
  try {
    const createdAt = new Date();

    const avatar: typeof schema.avatars.$inferSelect = {
      class: input.class,
      createdAt,
      id: createId(),
      level: 1,
      name: input.name,
      updatedAt: createdAt,
      userID: input.userID,
      xp: 0,
    };

    await ctx.db.insert(schema.avatars).values(avatar);

    return avatar;
  } catch (error: unknown) {
    logger.error(error);

    if (
      isPGError(error) &&
      isUniqueConstraintError(error, 'avatars_name_unique')
    ) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'An avatar with that name already exists',
      });
    }

    throw new TRPCError({
      cause: error,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unknown error occurred',
    });
  }
}

export const procedure = t.procedure
  .input(CreateAvatarInputSchema)
  .mutation(async ({ ctx, input }) => createAvatar(input, ctx));
