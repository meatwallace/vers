import { UserData } from '~/services/user-service/types';
import { builder } from '../builder';

export const User = builder.objectRef<UserData>('User');

User.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    username: t.exposeString('username'),
    name: t.exposeString('name'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});
