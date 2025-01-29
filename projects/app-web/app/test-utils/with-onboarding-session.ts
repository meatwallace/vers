import { ActionFunction, LoaderFunction } from 'react-router';
import { SESSION_KEY_VERIFY_ONBOARDING_EMAIL } from '~/session/consts';
import { verifySessionStorage } from '~/session/verify-session-storage.server';

export function withOnboardingSession(
  dataFn: LoaderFunction | ActionFunction,
  onboardingEmail: string,
): LoaderFunction | ActionFunction {
  return async ({ request, ...rest }) => {
    const verifySession = await verifySessionStorage.getSession(
      request.headers.get('cookie'),
    );

    verifySession.set(SESSION_KEY_VERIFY_ONBOARDING_EMAIL, onboardingEmail);

    const cookieHeader =
      await verifySessionStorage.commitSession(verifySession);

    request.headers.set('cookie', cookieHeader);

    return dataFn({ request, ...rest });
  };
}
