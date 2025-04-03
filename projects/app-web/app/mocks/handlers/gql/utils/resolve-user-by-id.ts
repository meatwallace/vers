import invariant from 'tiny-invariant';
import { db } from '../../../db';
import { addUserResolvedFields } from './add-user-resolved-fields';

export function resolveUserByID(userID: string) {
  const user = db.user.findFirst({
    where: { id: { equals: userID } },
  });

  invariant(user, 'User not found');

  return addUserResolvedFields(user);
}
