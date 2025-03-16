import { createCookieSessionStorage } from 'react-router';
import invariant from 'tiny-invariant';

// we prefix these session keys with the operation they're attached to
// to mitigate issues if the user has multiple operations in progress at once
export type SessionKey =
  // 2FA login
  | 'login2FA#sessionID'
  | 'login2FA#transactionID'
  | 'login2FA#transactionToken'

  // 2FA disable
  | 'disable2FA#transactionID'
  | 'disable2FA#transactionToken'

  // 2FA enable
  | 'enable2FA#transactionID'
  | 'enable2FA#transactionToken'

  // onboarding
  | 'onboarding#email'
  | 'onboarding#transactionID'
  | 'onboarding#transactionToken'

  // change email
  | 'changeEmail#transactionID'
  | 'changeEmail#transactionToken'

  // change email confirmation
  | 'changeEmailConfirm#transactionID'
  | 'changeEmailConfirm#transactionToken'

  // change password
  | 'changeUserPassword#transactionID'
  | 'changeUserPassword#transactionToken'

  // reset password
  | 'resetPassword#transactionID'
  | 'resetPassword#transactionToken';

export type SessionData = Record<SessionKey, string>;

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
