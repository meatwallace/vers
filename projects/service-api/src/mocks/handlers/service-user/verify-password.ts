import { TRPCError } from '@trpc/server';
import { db } from '../../db';
import { trpc } from './trpc';

export const verifyPassword = trpc.verifyPassword.mutation(({ input }) => {
  const user = db.user.findFirst({
    where: { email: { equals: input.email } },
  });

  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'No user with that email',
    });
  }

  if (user.passwordHash === null) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'User does not have a password set',
    });
  }

  // for the sake of our msw mocks we just store the raw password instead of the hash
  if (input.password !== user.passwordHash) {
    return { success: false };
  }

  return { success: true };
});
