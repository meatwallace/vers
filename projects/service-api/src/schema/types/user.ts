import { users } from '@campaign/postgres-schema';
import { builder } from '../builder';

export const User = builder.objectRef<typeof users.$inferSelect>('User');

User.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    email: t.exposeString('email'),
    emailVerified: t.exposeBoolean('emailVerified'),
    name: t.exposeString('name'),
    firstName: t.exposeString('firstName', { nullable: true }),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
  }),
});
