import { TRPCClientError } from '@trpc/client';
import type { AuthedContext } from '~/types';
import { logger } from '~/logger';
import { builder } from '../builder';
import {
  CHARACTER_LIMIT_REACHED_ERROR,
  CHARACTER_NAME_EXISTS_ERROR,
  UNKNOWN_ERROR,
} from '../errors';
import { Character } from '../types/character';
import { MutationErrorPayload } from '../types/mutation-error-payload';
import { createPayloadResolver } from '../utils/create-payload-resolver';
import { requireAuth } from '../utils/require-auth';

interface Args {
  input: typeof CreateCharacterInput.$inferInput;
}

// for now, we limit our users to 1 character. we can do this more
// elegantly later
const MAX_CHARACTERS = 2;

/**
 * @description Creates a new character for the authenticated user.
 * Users are limited to one character each.
 *
 * @example
 * ```gql
 * mutation CreateCharacter($input: CreateCharacterInput!) {
 *   createCharacter(input: $input) {
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
export async function createCharacter(
  _: object,
  args: Args,
  ctx: AuthedContext,
): Promise<typeof CreateCharacterPayload.$inferType> {
  try {
    const existingCharacters = await ctx.services.character.getCharacters.query(
      {
        userID: ctx.user.id,
      },
    );

    if (existingCharacters.length >= MAX_CHARACTERS) {
      return { error: CHARACTER_LIMIT_REACHED_ERROR };
    }

    const character = await ctx.services.character.createCharacter.mutate({
      name: args.input.name,
      userID: ctx.user.id,
    });

    return character;
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(error);
    }

    if (error instanceof TRPCClientError && error.data.code === 'CONFLICT') {
      return { error: CHARACTER_NAME_EXISTS_ERROR };
    }

    return { error: UNKNOWN_ERROR };
  }
}

const CreateCharacterInput = builder.inputType('CreateCharacterInput', {
  fields: (t) => ({
    name: t.string({ required: true }),
  }),
});

const CreateCharacterPayload = builder.unionType('CreateCharacterPayload', {
  resolveType: createPayloadResolver(Character),
  types: [Character, MutationErrorPayload],
});

export const resolve = requireAuth(createCharacter);

builder.mutationField('createCharacter', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: CreateCharacterInput }),
    },
    directives: {
      rateLimit: {
        duration: 60,
        limit: 10,
      },
    },
    resolve,
    type: CreateCharacterPayload,
  }),
);
