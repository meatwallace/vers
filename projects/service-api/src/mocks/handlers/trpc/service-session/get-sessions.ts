import { db } from '../../../db';
import { trpc } from './trpc';

export const getSessions = trpc.getSessions.query(({ input }) => {
  const sessions = db.session.findMany({
    where: { userID: { equals: input.userID } },
  });

  return sessions;
});
