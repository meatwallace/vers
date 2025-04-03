import type { GetAvatarPayload } from '@vers/service-types';
import { TRPCError } from '@trpc/server';
import * as schema from '@vers/postgres-schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { logger } from '~/logger';
import type { Context } from '../types';
import { t } from '../t';

const GetAvatarInputSchema = z.object({
  id: z.string(),
});

async function getAvatar(
  input: z.infer<typeof GetAvatarInputSchema>,
  ctx: Context,
): Promise<GetAvatarPayload> {
  try {
    const avatar = await ctx.db.query.avatars.findFirst({
      where: eq(schema.avatars.id, input.id),
    });

    return avatar ?? null;
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
  .input(GetAvatarInputSchema)
  .query(async ({ ctx, input }) => getAvatar(input, ctx));
