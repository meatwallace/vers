import { db } from '../../../db';
import { trpc } from './trpc';

export const getAvatar = trpc.getAvatar.query(({ input }) => {
  const avatar = db.avatar.findFirst({
    where: { id: { equals: input.id } },
  });

  return avatar ?? null;
});
