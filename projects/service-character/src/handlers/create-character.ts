import { createId } from '@paralleldrive/cuid2';
import { TRPCError } from '@trpc/server';
import * as schema from '@vers/postgres-schema';
import { CreateCharacterPayload } from '@vers/service-types';
import { isPGError, isUniqueConstraintError } from '@vers/service-utils';
import { CharacterNameSchema } from '@vers/validation';
import { z } from 'zod';
import { logger } from '~/logger';
import type { Context } from '../types';
import { t } from '../t';

const CreateCharacterInputSchema = z.object({
  name: CharacterNameSchema,
  userID: z.string(),
});

async function createCharacter(
  input: z.infer<typeof CreateCharacterInputSchema>,
  ctx: Context,
): Promise<CreateCharacterPayload> {
  try {
    const createdAt = new Date();

    const character: typeof schema.characters.$inferSelect = {
      createdAt,
      id: createId(),
      level: 1,
      name: input.name,
      updatedAt: createdAt,
      userID: input.userID,
      xp: 0,
    };

    await ctx.db.insert(schema.characters).values(character);

    return character;
  } catch (error: unknown) {
    logger.error(error);

    if (
      isPGError(error) &&
      isUniqueConstraintError(error, 'characters_name_unique')
    ) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'A character with that name already exists',
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
  .input(CreateCharacterInputSchema)
  .mutation(async ({ ctx, input }) => createCharacter(input, ctx));
