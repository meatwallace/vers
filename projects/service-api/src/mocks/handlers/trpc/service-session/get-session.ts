import { GetSessionPayload } from '@vers/service-types';
import { db } from '../../../db';
import { trpc } from './trpc';

export const getSession = trpc.getSession.query(({ input }) => {
  const session = db.session.findFirst({
    where: { id: { equals: input.id } },
  });

  return session as GetSessionPayload;
});
