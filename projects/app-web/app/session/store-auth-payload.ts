import { Session } from 'react-router';

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
  authSession.set('sessionID', authPayload.session.id);
  authSession.set('accessToken', authPayload.accessToken);
  authSession.set('refreshToken', authPayload.refreshToken);
}
