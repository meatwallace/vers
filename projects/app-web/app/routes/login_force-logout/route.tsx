import { data, redirect, Link as RRLink, useFetcher } from 'react-router';
import type { Styles } from '@vers/styled-system/css';
import { Brand, Heading, StatusButton, Text } from '@vers/design-system';
import { css } from '@vers/styled-system/css';
import invariant from 'tiny-invariant';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { LoginWithForcedLogoutMutation } from '~/data/mutations/login-with-forced-logout';
import { useIsFormPending } from '~/hooks/use-is-form-pending';
import { authSessionStorage } from '~/session/auth-session-storage.server.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { handleGQLError } from '~/utils/handle-gql-error.ts';
import { isMutationError } from '~/utils/is-mutation-error.ts';
import { requireAnonymous } from '~/utils/require-anonymous.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import type { Route } from './+types/route.ts';

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: 'vers | Login',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  await requireAnonymous(args.request);

  const verifySession = await verifySessionStorage.getSession(
    args.request.headers.get('cookie'),
  );

  const email = verifySession.get('loginLogout#email');
  const transactionToken = verifySession.get('loginLogout#transactionToken');

  if (!email || !transactionToken) {
    return redirect(Routes.Login);
  }

  return null;
});

enum ActionIntent {
  Cancel = 'cancel',
  Confirm = 'confirm',
}

export const action = withErrorHandling(async (args: Route.ActionArgs) => {
  await requireAnonymous(args.request);

  const formData = await args.request.formData();

  const intent = formData.get('intent');

  if (intent === ActionIntent.Confirm) {
    return handleConfirm(args);
  }

  if (intent === ActionIntent.Cancel) {
    return handleCancel(args);
  }

  return null;
});

async function handleConfirm(args: Route.ActionArgs) {
  const verifySession = await verifySessionStorage.getSession(
    args.request.headers.get('cookie'),
  );

  const target = verifySession.get('loginLogout#email');
  const transactionToken = verifySession.get('loginLogout#transactionToken');

  // if we're missing either of these we shouldn't be here, so ensure all related session
  // is cleaned up and bail out
  if (!target || !transactionToken) {
    verifySession.unset('loginLogout#email');
    verifySession.unset('loginLogout#transactionToken');

    return redirect(Routes.Login, {
      headers: {
        'Set-Cookie': await verifySessionStorage.commitSession(verifySession),
      },
    });
  }

  const result = await args.context.client.mutation(
    LoginWithForcedLogoutMutation,
    {
      input: {
        target,
        transactionToken,
      },
    },
  );

  if (result.error) {
    handleGQLError(result.error);

    return data({ error: 'Something went wrong' }, { status: 500 });
  }

  invariant(result.data, 'if no error, there must be data');

  if (isMutationError(result.data.loginWithForcedLogout)) {
    return data(
      { error: result.data.loginWithForcedLogout.error.message },
      { status: 400 },
    );
  }

  // yeet the unverified session ID from our 2FA login data incase that's how we ended up here
  verifySession.unset('login2FA#sessionID');

  verifySession.unset('loginLogout#email');
  verifySession.unset('loginLogout#transactionToken');

  const authSession = await authSessionStorage.getSession(
    args.request.headers.get('cookie'),
  );

  authSession.set('sessionID', result.data.loginWithForcedLogout.session.id);
  authSession.set('accessToken', result.data.loginWithForcedLogout.accessToken);
  authSession.set(
    'refreshToken',
    result.data.loginWithForcedLogout.refreshToken,
  );

  const headers = new Headers();

  headers.append(
    'set-cookie',
    await authSessionStorage.commitSession(authSession, {
      expires: new Date(result.data.loginWithForcedLogout.session.expiresAt),
    }),
  );

  headers.append(
    'set-cookie',
    await verifySessionStorage.commitSession(verifySession),
  );

  return redirect(Routes.Dashboard, { headers });
}

async function handleCancel(args: Route.ActionArgs) {
  const verifySession = await verifySessionStorage.getSession(
    args.request.headers.get('cookie'),
  );

  // our user was nice enough to cancel so we'll just clean up the session
  verifySession.unset('loginLogout#email');
  verifySession.unset('loginLogout#transactionToken');

  return redirect(Routes.Index, {
    headers: {
      'set-cookie': await verifySessionStorage.commitSession(verifySession),
    },
  });
}

const pageInfo = css({
  marginBottom: '4',
  textAlign: 'center',
});

const infoText: Styles = {
  marginBottom: '6',
};

const buttonContainer = css({
  alignItems: 'center',
  display: 'flex',
  gap: '4',
  justifyContent: 'center',
  marginBottom: '2',
  width: '96',
});

export function LoginForceLogout() {
  const confirmFetcher = useFetcher<{ error: string }>();
  const cancelFetcher = useFetcher<{ error: string }>();
  const isFormPending = useIsFormPending();

  const submitButtonStatus = isFormPending
    ? StatusButton.Status.Pending
    : StatusButton.Status.Idle;

  return (
    <>
      <section className={pageInfo}>
        <RRLink to={Routes.Index}>
          <Brand size="xl" />
        </RRLink>
        <Heading level={2}>You are logged in elsewhere</Heading>
        <Text css={infoText}>
          You are currently logged in somewhere else. To ensure your account can
          be properly synchronized, we need to log you out there, before we can
          log you in here.
        </Text>
        <Text>Would you like to logout your other sessions?</Text>
      </section>

      <div className={buttonContainer}>
        <confirmFetcher.Form method="POST">
          <StatusButton
            disabled={isFormPending}
            name="intent"
            status={submitButtonStatus}
            type="submit"
            value={ActionIntent.Confirm}
            variant="primary"
            fullWidth
          >
            Confirm
          </StatusButton>
        </confirmFetcher.Form>
        <cancelFetcher.Form method="POST">
          <StatusButton
            disabled={isFormPending}
            name="intent"
            status={submitButtonStatus}
            type="submit"
            value={ActionIntent.Cancel}
            variant="secondary"
            fullWidth
          >
            Cancel
          </StatusButton>
        </cancelFetcher.Form>
      </div>
      <FormErrorList
        errors={[confirmFetcher.data?.error, cancelFetcher.data?.error]}
      />
    </>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default LoginForceLogout;
