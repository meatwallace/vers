import type { GetSessionPayload } from '@vers/service-types';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import type { Context } from '../types';
import { logger } from '../logger';
import { t } from '../t';

export const GetSessionInputSchema = z.object({
  id: z.string(),
});

export async function getSession(
  input: z.infer<typeof GetSessionInputSchema>,
  ctx: Context,
): Promise<GetSessionPayload> {
  try {
    const session = await ctx.db.query.sessions.findFirst({
      where: (sessions, { eq }) => eq(sessions.id, input.id),
    });

    if (!session) {
      return null;
    }

    const { refreshToken, ...sessionWithoutRefreshToken } = session;

    return sessionWithoutRefreshToken;
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
  .input(GetSessionInputSchema)
  .query(async ({ ctx, input }) => getSession(input, ctx));
