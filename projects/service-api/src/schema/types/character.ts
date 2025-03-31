import type { CharacterData } from '@vers/service-types';
import invariant from 'tiny-invariant';
import { builder } from '../builder';
import { User } from './user';

export const Character = builder.objectRef<CharacterData>('Character');

Character.implement({
  fields: (t) => ({
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    id: t.exposeID('id'),
    level: t.exposeInt('level'),
    name: t.exposeString('name'),
    user: t.field({
      resolve: async (parent, args, ctx) => {
        const user = await ctx.services.user.getUser.query({
          id: parent.userID,
        });

        invariant(user, 'user must exist for session to be created');

        return user;
      },
      type: User,
    }),
    xp: t.exposeInt('xp'),
  }),
});
