import { createId } from '@paralleldrive/cuid2';
import { TRPCError } from '@trpc/server';
import * as schema from '@vers/postgres-schema';
import { CreateSessionPayload } from '@vers/service-types';
import { z } from 'zod';
import type { Context } from '../types';
import * as consts from '../consts';
import { t } from '../t';
import { createJWT } from '../utils/create-jwt';

export const CreateSessionInputSchema = z.object({
  expiresAt: z.date().optional(),
  ipAddress: z.string(),
  rememberMe: z.boolean().optional(),
  userID: z.string(),
});

export async function createSession(
  input: z.infer<typeof CreateSessionInputSchema>,
  ctx: Context,
): Promise<CreateSessionPayload> {
  try {
    const { expiresAt, ipAddress, rememberMe, userID } = input;

    const refreshTokenDuration = rememberMe
      ? consts.REFRESH_TOKEN_DURATION_LONG
      : consts.REFRESH_TOKEN_DURATION;

    const refreshTokenExpiresAt = expiresAt
      ? new Date(expiresAt)
      : new Date(Date.now() + refreshTokenDuration);

    const refreshToken = await createJWT({
      expiresAt: refreshTokenExpiresAt,
      userID,
    });

    const accessToken = await createJWT({
      expiresAt: new Date(Date.now() + consts.ACCESS_TOKEN_DURATION),
      userID,
    });

    const session: typeof schema.sessions.$inferSelect = {
      createdAt: new Date(),
      expiresAt: refreshTokenExpiresAt,
      id: createId(),
      ipAddress,
      refreshToken,
      updatedAt: new Date(),
      userID,
    };

    await ctx.db.insert(schema.sessions).values(session);

    return {
      accessToken,
      refreshToken,
      session,
    };
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
  .input(CreateSessionInputSchema)
  .mutation(async ({ ctx, input }) => createSession(input, ctx));
