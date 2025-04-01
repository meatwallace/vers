import { GraphQLError } from 'graphql';
import type { AuthedContext } from '~/types';
import { logger } from '~/logger';
import { builder } from '../builder';
import { Character } from '../types/character';
import { requireAuth } from '../utils/require-auth';

interface Args {
  input: typeof GetCharacterInput.$inferInput;
}

/**
 * @description Retrieves a character by ID. Returns null if not found.
 *
 * @example
 * ```gql
 * query GetCharacter($input: GetCharacterInput!) {
 *   getCharacter(input: $input) {
 *     id
 *     name
 *     level
 *     xp
 *     createdAt
 *     user {
 *       id
 *       name
 *     }
 *   }
 * }
 * ```
 */
export async function getCharacter(
  _: object,
  args: Args,
  ctx: AuthedContext,
): Promise<null | typeof Character.$inferType> {
  try {
    const character = await ctx.services.character.getCharacter.query({
      id: args.input.id,
    });

    return character;
  } catch (error: unknown) {
    if (error instanceof Error) {
      logger.error(error);
    }

    throw new GraphQLError('An unknown error occurred', {
      extensions: {
        code: 'INTERNAL_SERVER_ERROR',
      },
    });
  }
}

const GetCharacterInput = builder.inputType('GetCharacterInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
  }),
});

export const resolve = requireAuth(getCharacter);

builder.queryField('getCharacter', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: GetCharacterInput }),
    },
    directives: {
      rateLimit: {
        duration: 60,
        limit: 20,
      },
    },
    nullable: true,
    resolve,
    type: Character,
  }),
);
