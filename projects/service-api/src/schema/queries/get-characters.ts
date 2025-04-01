import { GraphQLError } from 'graphql';
import type { AuthedContext } from '~/types';
import { logger } from '~/logger';
import { builder } from '../builder';
import { Character } from '../types/character';
import { requireAuth } from '../utils/require-auth';

interface Args {
  input: typeof GetCharactersInput.$inferInput;
}

/**
 * @description Retrieves all characters for the authenticated user.
 *
 * @example
 * ```gql
 * query GetCharacters($input: GetCharactersInput!) {
 *   getCharacters(input: $input) {
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
export async function getCharacters(
  _: object,
  args: Args,
  ctx: AuthedContext,
): Promise<Array<typeof Character.$inferType>> {
  try {
    const characters = await ctx.services.character.getCharacters.query({
      userID: ctx.user.id,
    });

    return characters;
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

const GetCharactersInput = builder.inputType('GetCharactersInput', {
  fields: (t) => ({
    placeholder: t.string({ required: false }),
  }),
});

export const resolve = requireAuth(getCharacters);

builder.queryField('getCharacters', (t) =>
  t.field({
    args: {
      input: t.arg({ required: true, type: GetCharactersInput }),
    },
    directives: {
      rateLimit: {
        duration: 60,
        limit: 20,
      },
    },
    resolve,
    type: [Character],
  }),
);
