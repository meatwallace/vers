import { TRPCError } from '@trpc/server';
import { db } from '../../../db';
import { trpc } from './trpc';

export const updateCharacter = trpc.updateCharacter.mutation(({ input }) => {
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

  db.character.update({
    data: {
      name: input.name,
      updatedAt: new Date(),
    },
    where: {
      id: { equals: input.id },
    },
  });

  return { updatedID: character.id };
});
