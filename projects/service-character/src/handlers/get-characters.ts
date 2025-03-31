import { TRPCError } from '@trpc/server';
import * as schema from '@vers/postgres-schema';
import { GetCharactersPayload } from '@vers/service-types';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { logger } from '~/logger';
import type { Context } from '../types';
import { t } from '../t';

const GetCharactersInputSchema = z.object({
  userID: z.string(),
});

async function getCharacters(
  input: z.infer<typeof GetCharactersInputSchema>,
  ctx: Context,
): Promise<GetCharactersPayload> {
  try {
    const characters = await ctx.db.query.characters.findMany({
      where: eq(schema.characters.userID, input.userID),
    });

    return characters;
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
  .input(GetCharactersInputSchema)
  .query(async ({ ctx, input }) => getCharacters(input, ctx));
