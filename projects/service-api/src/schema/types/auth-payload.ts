import { builder } from '../builder';
import { Session } from './session';

export interface AuthPayloadData {
  refreshToken: string;
  accessToken: string;
  session: typeof Session.$inferType;
}

export const AuthPayload = builder.objectRef<AuthPayloadData>('AuthPayload');

AuthPayload.implement({
  fields: (t) => ({
    refreshToken: t.exposeString('refreshToken'),
    accessToken: t.exposeString('accessToken'),
    session: t.field({
      type: Session,
      resolve: (source) => source.session,
    }),
  }),
});
