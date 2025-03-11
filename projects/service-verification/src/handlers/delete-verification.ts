import type { DeleteVerificationPayload } from '@vers/service-types';
import { TRPCError } from '@trpc/server';
import * as schema from '@vers/postgres-schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import type { Context } from '../types';
import { logger } from '../logger';
import { t } from '../t';

export const DeleteVerificationInputSchema = z.object({
  id: z.string(),
});

export async function deleteVerification(
  input: z.infer<typeof DeleteVerificationInputSchema>,
  ctx: Context,
): Promise<DeleteVerificationPayload> {
  try {
    const [verification] = await ctx.db
      .delete(schema.verifications)
      .where(eq(schema.verifications.id, input.id))
      .returning({
        deletedID: schema.verifications.id,
      });

    const payload = {
      deletedID: verification.deletedID,
    };

    return payload;
  } catch (error: unknown) {
    logger.error(error);

    throw new TRPCError({
      cause: error,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unknown error occurred',
    });
  }
}

export const procedure = t.procedure
  .input(DeleteVerificationInputSchema)
  .mutation(async ({ ctx, input }) => deleteVerification(input, ctx));
