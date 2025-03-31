import { TRPCError } from '@trpc/server';
import * as schema from '@vers/postgres-schema';
import { GetCharacterPayload } from '@vers/service-types';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { logger } from '~/logger';
import type { Context } from '../types';
import { t } from '../t';

const GetCharacterInputSchema = z.object({
  id: z.string(),
});

async function getCharacter(
  input: z.infer<typeof GetCharacterInputSchema>,
  ctx: Context,
): Promise<GetCharacterPayload> {
  try {
    const character = await ctx.db.query.characters.findFirst({
      where: eq(schema.characters.id, input.id),
    });

    return character ?? null;
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
  .input(GetCharacterInputSchema)
  .query(async ({ ctx, input }) => getCharacter(input, ctx));
