import { createCookieSessionStorage } from 'react-router';
import invariant from 'tiny-invariant';

type SessionData = Record<string, string>;

interface SessionFlashData {
  error: string;
}

invariant(process.env.SESSION_SECRET, '$SESSION_SECRET is required');

export const verifySessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    domain: import.meta.env.VITE_DOMAIN,
    httpOnly: true,
    maxAge: 60 * 10,
    name: 'en_verification',
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],

    // only use secure cookies in prod because Safari doesn't allow setting secure cookies
    // for HTTP requests i.e. localhost which breaks our e2e
    secure: import.meta.env.PROD,
  },
});
