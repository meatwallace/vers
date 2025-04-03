import { TRPCError } from '@trpc/server';
import { db } from '../../../db';
import { trpc } from './trpc';

export const createAvatar = trpc.createAvatar.mutation(({ input }) => {
  const existingAvatar = db.avatar.findFirst({
    where: {
      name: { equals: input.name },
    },
  });

  if (existingAvatar) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'An Avatar with that name already exists',
    });
  }

  const avatar = db.avatar.create({
    class: input.class,
    name: input.name,
    userID: input.userID,
  });

  return avatar;
});
