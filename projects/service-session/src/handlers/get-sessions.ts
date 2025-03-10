import { TRPCError } from '@trpc/server';
import * as schema from '@vers/postgres-schema';
import { GetSessionsPayload } from '@vers/service-types';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import type { Context } from '../types';
import { t } from '../t';

export const GetSessionsInputSchema = z.object({
  userID: z.string(),
});

export async function getSessions(
  input: z.infer<typeof GetSessionsInputSchema>,
  ctx: Context,
): Promise<GetSessionsPayload> {
  try {
    const sessions = await ctx.db.query.sessions.findMany({
      where: eq(schema.sessions.userID, input.userID),
    });

    return sessions;
  } catch (error: unknown) {
    // TODO(#16): capture via Sentry
    throw new TRPCError({
      cause: error,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unknown error occurred',
    });
  }
}

export const procedure = t.procedure
  .input(GetSessionsInputSchema)
  .query(async ({ ctx, input }) => getSessions(input, ctx));
