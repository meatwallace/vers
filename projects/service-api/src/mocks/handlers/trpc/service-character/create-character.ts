import { TRPCError } from '@trpc/server';
import { db } from '../../../db';
import { trpc } from './trpc';

export const createCharacter = trpc.createCharacter.mutation(({ input }) => {
  const existingCharacter = db.character.findFirst({
    where: {
      name: { equals: input.name },
    },
  });

  if (existingCharacter) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'A character with that name already exists',
    });
  }

  const character = db.character.create({
    name: input.name,
    userID: input.userID,
  });

  return character;
});
