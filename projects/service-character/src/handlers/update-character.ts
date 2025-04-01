import { TRPCError } from '@trpc/server';
import * as schema from '@vers/postgres-schema';
import { UpdateCharacterPayload } from '@vers/service-types';
import { CharacterNameSchema } from '@vers/validation';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { logger } from '~/logger';
import type { Context } from '../types';
import { t } from '../t';

const UpdateCharacterInputSchema = z.object({
  id: z.string(),
  name: CharacterNameSchema,
  userID: z.string(),
});

async function updateCharacter(
  input: z.infer<typeof UpdateCharacterInputSchema>,
  ctx: Context,
): Promise<UpdateCharacterPayload> {
  try {
    const [character] = await ctx.db
      .update(schema.characters)
      .set({
        name: input.name,
        updatedAt: new Date(),
      })
      .where(eq(schema.characters.id, input.id))
      .returning({
        updatedID: schema.characters.id,
      });

    if (!character) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Character not found',
      });
    }

    return { updatedID: character.updatedID };
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
  .input(UpdateCharacterInputSchema)
  .mutation(async ({ ctx, input }) => updateCharacter(input, ctx));
