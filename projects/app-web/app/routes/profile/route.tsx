import { data, Form, redirect, useFetcher } from 'react-router';
import type { Styles } from '@vers/styled-system/css';
import { parseWithZod } from '@conform-to/zod';
import { Button, Heading, Link, StatusButton, Text } from '@vers/design-system';
import { css } from '@vers/styled-system/css';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { StartEnable2FAMutation } from '~/data/mutations/start-enable-2fa';
import { StartStepUpAuthMutation } from '~/data/mutations/start-step-up-auth';
import { GetCurrentUserQuery } from '~/data/queries/get-current-user';
import { StepUpAction, VerificationType } from '~/gql/graphql.ts';
import { useIsFormPending } from '~/hooks/use-is-form-pending.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types';
import { handleGQLError } from '~/utils/handle-gql-error.ts';
import { isMutationError } from '~/utils/is-mutation-error.ts';
import { requireAuth } from '~/utils/require-auth.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import type { Route } from './+types/route.ts';
import { QueryParam } from '../verify-otp/types.ts';

const TwoFactorDisableFormSchema = z.object({
  target: z.string().min(1),
});

export const meta: Route.MetaFunction = () => [
  {
    description: 'Manage your profile and security settings',
    title: 'vers | Profile',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  await requireAuth(args.request);

  const result = await args.context.client.query(GetCurrentUserQuery, {});

  if (result.error) {
    handleGQLError(result.error);

    throw result.error;
  }

  invariant(result.data, 'if no error, there must be data');

  return { user: result.data.getCurrentUser };
});

enum ActionIntent {
  Disable2FA = 'disable-2fa',
  Enable2FA = 'enable-2fa',
}

export const action = withErrorHandling(async (args: Route.ActionArgs) => {
  await requireAuth(args.request);

  const formData = await args.request.formData();

  const intent = formData.get('intent');

  if (intent === ActionIntent.Enable2FA) {
    return handleEnable2FA(args);
  }

  if (intent === ActionIntent.Disable2FA) {
    return handleDisable2FA(args, formData);
  }

  return null;
});

async function handleEnable2FA(args: Route.ActionArgs) {
  const result = await args.context.client.mutation(StartEnable2FAMutation, {
    input: {},
  });

  if (result.error) {
    handleGQLError(result.error);

    return data({ error: 'Something went wrong' }, { status: 500 });
  }

  invariant(result.data, 'if no error, there must be data');

  if (isMutationError(result.data.startEnable2FA)) {
    return data(
      { error: result.data.startEnable2FA.error.message },
      { status: 400 },
    );
  }

  const verifySession = await verifySessionStorage.getSession(
    args.request.headers.get('cookie'),
  );

  verifySession.set(
    'enable2FA#transactionID',
    result.data.startEnable2FA.transactionID,
  );

  return redirect(Routes.ProfileVerify2FA, {
    headers: {
      'Set-Cookie': await verifySessionStorage.commitSession(verifySession),
    },
  });
}

async function handleDisable2FA(args: Route.ActionArgs, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: TwoFactorDisableFormSchema,
  });

  if (submission.status !== 'success') {
    return data({ error: submission.error?.message }, { status: 400 });
  }

  const result = await args.context.client.mutation(StartStepUpAuthMutation, {
    input: {
      action: StepUpAction.Disable_2Fa,
    },
  });

  if (result.error) {
    handleGQLError(result.error);

    return data({ error: 'Something went wrong' }, { status: 500 });
  }

  invariant(result.data, 'if no error, there must be data');

  if (isMutationError(result.data.startStepUpAuth)) {
    return data(
      { error: result.data.startStepUpAuth.error.message },
      { status: 400 },
    );
  }

  const verifySession = await verifySessionStorage.getSession(
    args.request.headers.get('cookie'),
  );

  verifySession.set(
    'disable2FA#transactionID',
    result.data.startStepUpAuth.transactionID,
  );

  const searchParams = new URLSearchParams({
    [QueryParam.Target]: submission.value.target,
    [QueryParam.Type]: VerificationType.TwoFactorAuthDisable,
  });

  return redirect(`${Routes.VerifyOTP}?${searchParams.toString()}`, {
    headers: {
      'Set-Cookie': await verifySessionStorage.commitSession(verifySession),
    },
  });
}

const profileSection = css({
  alignSelf: 'flex-start',
  borderBottomWidth: '1',
  borderColor: 'neutral.800',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '3',
  paddingBottom: '3',
  width: 'full',
});

const profileInfoRow = css({
  marginBottom: '2',
});

const profileInfoLabel: Styles = {
  color: 'neutral.500',
  fontWeight: 'bold',
  marginBottom: '1',
};

const profileInfoValue: Styles = {
  marginBottom: '1',
};

const twoFactorDescription: Styles = {
  color: 'neutral.500',
  marginBottom: '4',
};

export function Profile(props: Route.ComponentProps) {
  const twoFactorFetcher = useFetcher<{ error: string }>();
  const isFormPending = useIsFormPending();

  const submitButtonStatus = isFormPending
    ? StatusButton.Status.Pending
    : StatusButton.Status.Idle;

  const { user } = props.loaderData;

  return (
    <>
      <Heading level={2}>Account Management</Heading>
      <section className={profileSection}>
        <Heading level={3}>User Information</Heading>
        <div className={profileInfoRow}>
          <Text css={profileInfoLabel}>Username</Text>
          <Text css={profileInfoValue}>{user.username}</Text>
        </div>
        <div className={profileInfoRow}>
          <Text css={profileInfoLabel}>Name</Text>
          <Text css={profileInfoValue}>{user.name}</Text>
        </div>
        <div className={profileInfoRow}>
          <Text css={profileInfoLabel}>Email</Text>
          <Text css={profileInfoValue}>{user.email}</Text>
          <Link to={Routes.ProfileChangeEmail}>Change Email</Link>
        </div>
      </section>
      <section className={profileSection}>
        <Heading level={3}>Secure Actions</Heading>
        <Link to={Routes.ProfileChangePassword}>Change Password</Link>
        <Form action={Routes.Logout} method="post">
          <Button variant="link">Logout</Button>
        </Form>
      </section>
      <section className={profileSection}>
        <Heading level={3}>Two-Factor Authentication</Heading>

        {user.is2FAEnabled && (
          <>
            <Text>You have enabled two-factor authentication.</Text>
            <twoFactorFetcher.Form method="post">
              <input name="target" type="hidden" value={user.email} />
              <StatusButton
                disabled={isFormPending}
                name="intent"
                status={submitButtonStatus}
                type="submit"
                value={ActionIntent.Disable2FA}
              >
                Disable 2FA
              </StatusButton>
            </twoFactorFetcher.Form>
            {twoFactorFetcher.data?.error && (
              <p>{twoFactorFetcher.data.error}</p>
            )}
          </>
        )}

        {!user.is2FAEnabled && (
          <>
            <Text>
              Two-factor authentication is <strong>not enabled</strong>.
            </Text>
            <Text css={twoFactorDescription}>
              Two factor authentication adds an extra layer of security to your
              account. You will need to enter a code from an authenticator app
              like <Link to="https://1password.com">1Password</Link> to log in.
            </Text>
            <twoFactorFetcher.Form method="post">
              <input name="target" type="hidden" value={user.email} />
              <StatusButton
                disabled={isFormPending}
                name="intent"
                status={submitButtonStatus}
                type="submit"
                value={ActionIntent.Enable2FA}
                variant="primary"
              >
                Enable 2FA
              </StatusButton>
            </twoFactorFetcher.Form>
            {twoFactorFetcher.data?.error && (
              <p>{twoFactorFetcher.data.error}</p>
            )}
          </>
        )}
      </section>
    </>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default Profile;
