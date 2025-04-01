import type { AuthedContext } from '~/types';
import { logger } from '~/logger';
import { builder } from '../builder';
import { UNKNOWN_ERROR } from '../errors';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { MutationSuccess } from '../types/mutation-success';
import { createPayloadResolver } from '../utils/create-payload-resolver';
import { requireAuth } from '../utils/require-auth';

interface Args {
  input: typeof UpdateCharacterInput.$inferInput;
}

/**
 * @description Updates a character's name.
 *
 * @example
 * ```gql
 * mutation UpdateCharacter($input: UpdateCharacterInput!) {
 *   updateCharacter(input: $input) {
 *     ... on Character {
 *       id
 *       name
 *       level
 *       xp
 *       createdAt
 *       user {
 *         id
 *         name
 *       }
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
export async function updateCharacter(
  _: object,
  args: Args,
  ctx: AuthedContext,
): Promise<typeof UpdateCharacterPayload.$inferType> {
  try {
    await ctx.services.character.updateCharacter.mutate({
      id: args.input.id,
      name: args.input.name,
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

const UpdateCharacterInput = builder.inputType('UpdateCharacterInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
    name: t.string({ required: true }),
  }),
});

const UpdateCharacterPayload = builder.unionType('UpdateCharacterPayload', {
  resolveType: createPayloadResolver(MutationSuccess),
  types: [MutationSuccess, MutationErrorPayload],
});

export const resolve = requireAuth(updateCharacter);

builder.mutationField('updateCharacter', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: UpdateCharacterInput }),
    },
    directives: {
      rateLimit: {
        duration: 60,
        limit: 10,
      },
    },
    resolve,
    type: UpdateCharacterPayload,
  }),
);
