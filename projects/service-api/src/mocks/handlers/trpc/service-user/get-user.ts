import { TRPCError } from '@trpc/server';
import { db } from '../../../db';
import { trpc } from './trpc';

export const getUser = trpc.getUser.query(({ input }) => {
  if (!input.id && !input.email) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Either ID or email must be provided',
    });
  }

  const user = db.user.findFirst({
    where: {
      ...(input.id && { id: { equals: input.id } }),
      ...(input.email && { email: { equals: input.email } }),
    },
  });

  return user;
});
