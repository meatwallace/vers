import { data, Form, MetaFunction, redirect } from 'react-router';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import QRCode from 'qrcode';
import { z } from 'zod';
import { OTPField } from '~/components/field/otp-field';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { StatusButton } from '~/components/status-button';
import { VerifyOTP } from '~/data/mutations/verify-otp';
import { GetCurrentUser } from '~/data/queries/get-current-user.ts';
import { graphql } from '~/gql';
import { VerificationType } from '~/gql/graphql.ts';
import { useIsFormPending } from '~/hooks/use-is-form-pending.ts';
import { SESSION_KEY_VERIFY_TRANSACTION_ID } from '~/session/consts.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { isMutationError } from '~/utils/is-mutation-error.ts';
import { requireAuth } from '~/utils/require-auth.server.ts';
import type { Route } from './+types/route.ts';
import * as styles from './route.css.ts';

const GetEnable2FAVerification = graphql(/* GraphQL */ `
  query GetEnable2FAVerification {
    getEnable2FAVerification {
      otpURI
    }
  }
`);

const FinishEnable2FA = graphql(/* GraphQL */ `
  mutation FinishEnable2FA($input: FinishEnable2FAInput!) {
    finishEnable2FA(input: $input) {
      ... on MutationSuccess {
        success
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

const VerifyOTPFormSchema = z.object({
  code: z.string().length(6, 'Invalid code'),
  target: z.string().min(1),
});

export async function loader({ request }: Route.LoaderArgs) {
  const client = createGQLClient();

  await requireAuth(request, { client });

  const { getCurrentUser } = await client.request(GetCurrentUser, {});

  // if we've already got 2FA enabled send us back to the profile page
  if (getCurrentUser.is2FAEnabled) {
    return redirect(Routes.Profile);
  }

  const { getEnable2FAVerification } = await client.request(
    GetEnable2FAVerification,
    {},
  );

  const qrCode = await QRCode.toDataURL(getEnable2FAVerification.otpURI);

  return {
    otpURI: getEnable2FAVerification.otpURI,
    qrCode,
    target: getCurrentUser.email,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const client = createGQLClient();

  const { sessionID } = await requireAuth(request, { client });

  const formData = await request.formData();

  const submission = parseWithZod(formData, { schema: VerifyOTPFormSchema });

  if (submission.status !== 'success') {
    const result = submission.reply();
    const status = submission.status === 'error' ? 400 : 200;

    return data({ result }, { status });
  }

  const verifySession = await verifySessionStorage.getSession(
    request.headers.get('cookie'),
  );

  const transactionID = verifySession.get(SESSION_KEY_VERIFY_TRANSACTION_ID);

  // if we don't have a transaction ID then we really shouldn't be here.
  if (!transactionID) {
    const result = submission.reply({
      formErrors: ['Something went wrong.'],
    });

    return data({ result }, { status: 400 });
  }

  const { verifyOTP } = await client.request(VerifyOTP, {
    input: {
      code: submission.value.code,
      sessionID,
      target: submission.value.target,
      transactionID,
      type: VerificationType.TwoFactorAuthSetup,
    },
  });

  if (isMutationError(verifyOTP)) {
    const result = submission.reply({
      formErrors: [verifyOTP.error.message],
    });

    return data({ result }, { status: 400 });
  }

  const { finishEnable2FA } = await client.request(FinishEnable2FA, {
    input: {
      transactionToken: verifyOTP.transactionToken,
    },
  });

  const setCookieHeader =
    await verifySessionStorage.destroySession(verifySession);

  if (isMutationError(finishEnable2FA)) {
    const result = submission.reply({
      formErrors: [finishEnable2FA.error.message],
    });

    return data(
      { result },
      { headers: { 'Set-Cookie': setCookieHeader }, status: 400 },
    );
  }

  return redirect(Routes.Profile, {
    headers: { 'Set-Cookie': setCookieHeader },
  });
}

export const meta: MetaFunction = () => [
  {
    description: 'Verify your 2FA setup',
    title: 'Verify 2FA',
  },
];

export function ProfileVerify2FARoute({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const isFormPending = useIsFormPending();

  const [form, fields] = useForm({
    constraint: getZodConstraint(VerifyOTPFormSchema),
    defaultValue: {
      target: loaderData.target,
    },
    id: 'verify-2fa-form',
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifyOTPFormSchema });
    },
  });

  const submitButtonStatus = isFormPending
    ? StatusButton.Status.Pending
    : StatusButton.Status.Idle;

  return (
    <>
      <main className={styles.container}>
        <section className={styles.section}>
          <h1>Set Up 2FA</h1>

          <div className={styles.instructions}>
            <p>Scan this QR code with your authenticator app.</p>
            <p>
              Once you&apos;ve added the account, enter the code from your
              authenticator app below. Once you enable 2FA, you will need to
              enter a code from your authenticator app every time you log in or
              perform important actions. Do not lose access to your
              authenticator app, or you will lose access to your account.
            </p>
          </div>

          <div className={styles.qrCodeContainer}>
            <img
              alt="QR code for 2FA"
              className={styles.qrCode}
              src={loaderData.qrCode}
            />
          </div>

          <div className={styles.manualCode}>
            <p>
              If you cannot scan the QR code, you can manually add this account
              to your authenticator app using this code:
            </p>
            <code className={styles.code}>{loaderData.otpURI}</code>
          </div>

          <Form method="POST" {...getFormProps(form)}>
            <OTPField
              errors={fields.code.errors ?? []}
              inputProps={{
                ...getInputProps(fields.code, { type: 'text' }),
                autoComplete: 'one-time-code',
                autoFocus: true,
              }}
              labelProps={{
                children: 'Code',
                htmlFor: fields.code.id,
              }}
            />
            <input {...getInputProps(fields.target, { type: 'hidden' })} />
            <FormErrorList errors={form.errors ?? []} id={form.errorId} />
            <StatusButton status={submitButtonStatus} type="submit">
              Submit
            </StatusButton>
          </Form>
        </section>
      </main>
    </>
  );
}

export default ProfileVerify2FARoute;

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}
