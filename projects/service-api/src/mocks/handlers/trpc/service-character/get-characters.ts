import { db } from '../../../db';
import { trpc } from './trpc';

export const getCharacters = trpc.getCharacters.query(({ input }) => {
  const characters = db.character.findMany({
    where: {
      userID: { equals: input.userID },
    },
  });

  return characters;
});
