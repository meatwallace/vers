import type { GetAvatarsPayload } from '@vers/service-types';
import { TRPCError } from '@trpc/server';
import * as schema from '@vers/postgres-schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { logger } from '~/logger';
import type { Context } from '../types';
import { t } from '../t';

const GetAvatarsInputSchema = z.object({
  userID: z.string(),
});

async function getAvatars(
  input: z.infer<typeof GetAvatarsInputSchema>,
  ctx: Context,
): Promise<GetAvatarsPayload> {
  try {
    const avatars = await ctx.db.query.avatars.findMany({
      where: eq(schema.avatars.userID, input.userID),
    });

    return avatars;
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
  .input(GetAvatarsInputSchema)
  .query(async ({ ctx, input }) => getAvatars(input, ctx));
