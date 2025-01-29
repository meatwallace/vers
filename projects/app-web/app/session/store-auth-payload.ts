import { Session } from 'react-router';
import {
  SESSION_KEY_AUTH_SESSION_ID,
  SESSION_KEY_AUTH_ACCESS_TOKEN,
  SESSION_KEY_AUTH_REFRESH_TOKEN,
} from './consts.ts';

type AuthPayload = {
  accessToken: string;
  refreshToken: string;
  session: {
    id: string;
    expiresAt: string;
  };
};

export function storeAuthPayload(
  authSession: Session,
  authPayload: AuthPayload,
) {
  authSession.set(SESSION_KEY_AUTH_SESSION_ID, authPayload.session.id);
  authSession.set(SESSION_KEY_AUTH_ACCESS_TOKEN, authPayload.accessToken);
  authSession.set(SESSION_KEY_AUTH_REFRESH_TOKEN, authPayload.refreshToken);
}
