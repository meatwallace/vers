import { builder } from '../builder';
import { Session } from './session';

export interface AuthPayloadData {
  accessToken: string;
  refreshToken: string;
  session: typeof Session.$inferType;
}

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
