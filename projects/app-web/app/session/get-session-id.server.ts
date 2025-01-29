import { Session } from 'react-router';
import { SESSION_KEY_AUTH_ACCESS_TOKEN } from '~/session/consts.ts';

export async function getSessionID(
  authSession: Session,
): Promise<string | null> {
  return authSession.get(SESSION_KEY_AUTH_ACCESS_TOKEN) ?? null;
}
