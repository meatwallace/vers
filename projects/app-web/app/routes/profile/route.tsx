import { data, redirect, useFetcher } from 'react-router';
import { parseWithZod } from '@conform-to/zod';
import { GraphQLClient } from 'graphql-request';
import { z } from 'zod';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { StatusButton } from '~/components/status-button.tsx';
import { GetCurrentUser } from '~/data/queries/get-current-user';
import { graphql } from '~/gql';
import { VerificationType } from '~/gql/graphql.ts';
import { useIsFormPending } from '~/hooks/use-is-form-pending.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { isMutationError } from '~/utils/is-mutation-error.ts';
import { requireAuth } from '~/utils/require-auth.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import type { Route } from './+types/route.ts';
import { QueryParam } from '../verify-otp/types.ts';

const StartEnable2FAMutation = graphql(/* GraphQL */ `
  mutation StartEnable2FA($input: StartEnable2FAInput!) {
    startEnable2FA(input: $input) {
      ... on TwoFactorRequiredPayload {
        transactionID
      }

      ... on MutationErrorPayload {
        error {
          title
          message
        }
      }
    }
  }
`);

const StartDisable2FA = graphql(/* GraphQL */ `
  mutation StartDisable2FA($input: StartDisable2FAInput!) {
    startDisable2FA(input: $input) {
      ... on TwoFactorRequiredPayload {
        transactionID
      }

      ... on MutationErrorPayload {
        error {
          title
          message
        }
      }
    }
  }
`);

const TwoFactorDisableFormSchema = z.object({
  target: z.string().min(1),
});

export const meta: Route.MetaFunction = () => [
  {
    description: 'Manage your profile and security settings',
    title: 'Vers | Profile',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  const { request } = args;

  const client = createGQLClient();

  await requireAuth(request, { client });

  const { getCurrentUser } = await client.request(GetCurrentUser, {});

  return { user: getCurrentUser };
});

enum ActionIntent {
  Disable2FA = 'disable-2fa',
  Enable2FA = 'enable-2fa',
}

export const action = withErrorHandling(async (args: Route.ActionArgs) => {
  const { request } = args;

  const client = createGQLClient();

  await requireAuth(request, { client });

  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === ActionIntent.Enable2FA) {
    return handleEnable2FA(client, request);
  }

  if (intent === ActionIntent.Disable2FA) {
    return handleDisable2FA(client, request, formData);
  }

  return null;
});

async function handleEnable2FA(client: GraphQLClient, request: Request) {
  const { startEnable2FA } = await client.request(StartEnable2FAMutation, {
    input: {},
  });

  if (isMutationError(startEnable2FA)) {
    return data({ error: startEnable2FA.error.message }, { status: 400 });
  }

  const verifySession = await verifySessionStorage.getSession(
    request.headers.get('cookie'),
  );

  verifySession.set('transactionID', startEnable2FA.transactionID);

  return redirect(Routes.ProfileVerify2FA, {
    headers: {
      'Set-Cookie': await verifySessionStorage.commitSession(verifySession),
    },
  });
}

async function handleDisable2FA(
  client: GraphQLClient,
  request: Request,
  formData: FormData,
) {
  const submission = parseWithZod(formData, {
    schema: TwoFactorDisableFormSchema,
  });

  if (submission.status !== 'success') {
    return data({ error: submission.error?.message }, { status: 400 });
  }

  const { startDisable2FA } = await client.request(StartDisable2FA, {
    input: {},
  });

  if (isMutationError(startDisable2FA)) {
    return data({ error: startDisable2FA.error.message }, { status: 400 });
  }

  const verifySession = await verifySessionStorage.getSession(
    request.headers.get('cookie'),
  );

  verifySession.set('transactionID', startDisable2FA.transactionID);

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

export function Profile(props: Route.ComponentProps) {
  const twoFactorFetcher = useFetcher<{ error: string }>();
  const isFormPending = useIsFormPending();

  const submitButtonStatus = isFormPending
    ? StatusButton.Status.Pending
    : StatusButton.Status.Idle;

  const { user } = props.loaderData;

  return (
    <>
      <main>
        <section>
          <h1>Profile</h1>
          <div>
            <p>Name</p>
            <p>{user.name}</p>
            <p>Email</p>
            <p>{user.email}</p>
          </div>
        </section>
        <section>
          <h2>Security Settings</h2>
          <div>
            <h3>Two-Factor Authentication</h3>

            {user.is2FAEnabled && (
              <>
                <p>You have enabled two-factor authentication.</p>
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
                <p>
                  Two factor authentication adds an extra layer of security to
                  your account. You will need to enter a code from an
                  authenticator app like{' '}
                  <a href="https://1password.com">1Password</a> to log in.
                </p>
                <twoFactorFetcher.Form method="post">
                  <input name="target" type="hidden" value={user.email} />
                  <StatusButton
                    disabled={isFormPending}
                    name="intent"
                    status={submitButtonStatus}
                    type="submit"
                    value={ActionIntent.Enable2FA}
                  >
                    Enable 2FA
                  </StatusButton>
                </twoFactorFetcher.Form>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default Profile;
