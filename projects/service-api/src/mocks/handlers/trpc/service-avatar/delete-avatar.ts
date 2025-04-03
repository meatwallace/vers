import { TRPCError } from '@trpc/server';
import { db } from '../../../db';
import { trpc } from './trpc';

export const deleteAvatar = trpc.deleteAvatar.mutation(({ input }) => {
  const avatar = db.avatar.findFirst({
    where: {
      id: { equals: input.id },
      userID: { equals: input.userID },
    },
  });

  if (!avatar) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Avatar not found',
    });
  }

  db.avatar.delete({
    where: {
      id: { equals: input.id },
    },
  });

  return { deletedID: avatar.id };
});
