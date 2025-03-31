import { createId } from '@paralleldrive/cuid2';
import { TRPCError } from '@trpc/server';
import * as schema from '@vers/postgres-schema';
import { CreateCharacterPayload } from '@vers/service-types';
import { CharacterNameSchema } from '@vers/validation';
import { eq } from 'drizzle-orm';
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
    const existingCharacter = await ctx.db.query.characters.findFirst({
      where: eq(schema.characters.userID, input.userID),
    });

    // for now, we limit our users to 1 character
    if (existingCharacter) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'User already has a character',
      });
    }

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
  .input(CreateCharacterInputSchema)
  .mutation(async ({ ctx, input }) => createCharacter(input, ctx));
