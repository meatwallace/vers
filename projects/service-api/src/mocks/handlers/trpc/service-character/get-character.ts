import { db } from '../../../db';
import { trpc } from './trpc';

export const getCharacter = trpc.getCharacter.query(({ input }) => {
  const character = db.character.findFirst({
    where: { id: { equals: input.id } },
  });

  return character ?? null;
});
