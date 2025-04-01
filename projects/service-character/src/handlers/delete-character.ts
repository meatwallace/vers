import { TRPCError } from '@trpc/server';
import * as schema from '@vers/postgres-schema';
import { DeleteCharacterPayload } from '@vers/service-types';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { logger } from '~/logger';
import type { Context } from '../types';
import { t } from '../t';

const DeleteCharacterInputSchema = z.object({
  id: z.string(),
  userID: z.string(),
});

async function deleteCharacter(
  input: z.infer<typeof DeleteCharacterInputSchema>,
  ctx: Context,
): Promise<DeleteCharacterPayload> {
  try {
    const [character] = await ctx.db
      .delete(schema.characters)
      .where(eq(schema.characters.id, input.id))
      .returning({ id: schema.characters.id });

    if (!character) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Character not found',
      });
    }

    return { deletedID: character.id };
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
  .input(DeleteCharacterInputSchema)
  .mutation(async ({ ctx, input }) => deleteCharacter(input, ctx));
