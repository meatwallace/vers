import { db } from '../../../db';
import { trpc } from './trpc';

export const getAvatars = trpc.getAvatars.query(({ input }) => {
  const avatars = db.avatar.findMany({
    where: {
      userID: { equals: input.userID },
    },
  });

  return avatars;
});
