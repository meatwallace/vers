import { Session } from 'react-router';
import {
  SESSION_KEY_AUTH_ACCESS_TOKEN,
  SESSION_KEY_AUTH_REFRESH_TOKEN,
  SESSION_KEY_AUTH_SESSION_ID,
} from './consts.ts';

interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  session: {
    expiresAt: string;
    id: string;
  };
}

export function storeAuthPayload(
  authSession: Session,
  authPayload: AuthPayload,
) {
  authSession.set(SESSION_KEY_AUTH_SESSION_ID, authPayload.session.id);
  authSession.set(SESSION_KEY_AUTH_ACCESS_TOKEN, authPayload.accessToken);
  authSession.set(SESSION_KEY_AUTH_REFRESH_TOKEN, authPayload.refreshToken);
}
