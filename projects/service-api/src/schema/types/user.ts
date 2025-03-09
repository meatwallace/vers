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
    is2FAEnabled: t.boolean({
      resolve: async (user, _, ctx) => {
        const verification = await ctx.services.verification.getVerification({
          type: '2fa',
          target: user.email,
        });
        return !!verification;
      },
    }),
  }),
});
