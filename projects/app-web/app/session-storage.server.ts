import invariant from 'tiny-invariant';
import { createCookieSessionStorage } from 'react-router';

type SessionData = {
  [key: string]: string;
};

type SessionFlashData = {
  error: string;
};

invariant(process.env.SESSION_SECRET, '$SESSION_SECRET is required');

export const sessionStorage = createCookieSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: '__session',
    domain: import.meta.env.VITE_DOMAIN,
    httpOnly: true,
    maxAge: 60,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],

    // only use secure cookies in prod because Safari doesn't allow setting secure cookies
    // for HTTP requests i.e. localhost which breaks our e2e
    secure: import.meta.env.PROD,
  },
});
