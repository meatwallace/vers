import { TRPCError } from '@trpc/server';
import { db } from '../../../db';
import { trpc } from './trpc';

export const updateAvatar = trpc.updateAvatar.mutation(({ input }) => {
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

  db.avatar.update({
    data: {
      name: input.name,
      updatedAt: new Date(),
    },
    where: {
      id: { equals: input.id },
    },
  });

  return { updatedID: avatar.id };
});
