import { TRPCError } from '@trpc/server';
import { db } from '../../../db';
import { trpc } from './trpc';

export const deleteCharacter = trpc.deleteCharacter.mutation(({ input }) => {
  const character = db.character.findFirst({
    where: {
      id: { equals: input.id },
      userID: { equals: input.userID },
    },
  });

  if (!character) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Character not found',
    });
  }

  db.character.delete({
    where: {
      id: { equals: input.id },
    },
  });

  return { deletedID: character.id };
});
