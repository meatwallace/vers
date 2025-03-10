import type { AuthPayload as AuthPayloadData } from '@vers/service-types';
import { builder } from '../builder';
import { Session } from './session';

export const AuthPayload = builder.objectRef<AuthPayloadData>('AuthPayload');

AuthPayload.implement({
  fields: (t) => ({
    accessToken: t.exposeString('accessToken'),
    refreshToken: t.exposeString('refreshToken'),
    session: t.field({
      resolve: (source) => source.session,
      type: Session,
    }),
  }),
});
