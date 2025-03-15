import type { Session } from 'react-router';
import type { SessionData } from './auth-session-storage.server.ts';

interface AuthPayload {
  accessToken: string;
  refreshToken: string;
  session: {
    id: string;
  };
}

export function storeAuthPayload(
  authSession: Session<SessionData>,
  authPayload: AuthPayload,
) {
  authSession.set('sessionID', authPayload.session.id);
  authSession.set('accessToken', authPayload.accessToken);
  authSession.set('refreshToken', authPayload.refreshToken);
}
