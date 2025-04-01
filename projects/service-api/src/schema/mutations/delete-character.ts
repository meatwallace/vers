import type { AuthedContext } from '~/types';
import { logger } from '~/logger';
import { builder } from '../builder';
import { UNKNOWN_ERROR } from '../errors';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { MutationSuccess } from '../types/mutation-success';
import { createPayloadResolver } from '../utils/create-payload-resolver';
import { requireAuth } from '../utils/require-auth';

interface Args {
  input: typeof DeleteCharacterInput.$inferInput;
}

/**
 * @description Deletes a character.
 *
 * @example
 * ```gql
 * mutation DeleteCharacter($input: DeleteCharacterInput!) {
 *   deleteCharacter(input: $input) {
 *     ... on MutationSuccess {
 *       success
 *     }
 *     ... on MutationErrorPayload {
 *       error {
 *         title
 *         message
 *       }
 *     }
 *   }
 * }
 * ```
 */
export async function deleteCharacter(
  _: object,
  args: Args,
  ctx: AuthedContext,
): Promise<typeof DeleteCharacterPayload.$inferType> {
  try {
    await ctx.services.character.deleteCharacter.mutate({
      id: args.input.id,
      userID: ctx.user.id,
    });

    return { success: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(error);
    }

    return { error: UNKNOWN_ERROR };
  }
}

const DeleteCharacterInput = builder.inputType('DeleteCharacterInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});

const DeleteCharacterPayload = builder.unionType('DeleteCharacterPayload', {
  resolveType: createPayloadResolver(MutationSuccess),
  types: [MutationSuccess, MutationErrorPayload],
});

export const resolve = requireAuth(deleteCharacter);

builder.mutationField('deleteCharacter', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: DeleteCharacterInput }),
    },
    directives: {
      rateLimit: {
        duration: 60,
        limit: 10,
      },
    },
    resolve,
    type: DeleteCharacterPayload,
  }),
);
