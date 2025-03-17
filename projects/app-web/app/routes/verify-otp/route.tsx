import { data, Form, redirect, useSearchParams } from 'react-router';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { captureException } from '@sentry/react';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import type { SessionKey } from '~/session/verify-session-storage.server.ts';
import { OTPField } from '~/components/field/index.ts';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { StatusButton } from '~/components/status-button.tsx';
import { VerifyOTPMutation } from '~/data/mutations/verify-otp.ts';
import { VerificationType } from '~/gql/graphql.ts';
import { useIsFormPending } from '~/hooks/use-is-form-pending.ts';
import { authSessionStorage } from '~/session/auth-session-storage.server.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { checkHoneypot } from '~/utils/check-honeypot.server.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { handleGQLError } from '~/utils/handle-gql-error.ts';
import { isMutationError } from '~/utils/is-mutation-error.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import { Route } from './+types/route.ts';
import { handleVerification } from './handle-verification.server.ts';
import { QueryParam } from './types.ts';

const VerificationTypeSchema = z.nativeEnum(VerificationType);

export const VerifyOTPFormSchema = z.object({
  [QueryParam.Code]: z.string().length(6, 'Invalid code'),
  [QueryParam.RedirectTo]: z.string().optional(),
  [QueryParam.Target]: z.string().min(1),
  [QueryParam.Type]: VerificationTypeSchema,
});

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: 'Vers | Verify OTP',
  },
];

// eslint-disable-next-line @typescript-eslint/require-await
export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  const { request } = args;

  const url = new URL(request.url);

  const typeParam = url.searchParams.get(QueryParam.Type);
  const typeParsedWithZod = VerificationTypeSchema.safeParse(typeParam);

  if (!typeParsedWithZod.success) {
    const error = new Error(`Invalid verification type: ${typeParam}`);

    captureException(error);

    return redirect(Routes.Index);
  }

  return {};
});

const transactionIDKeys: Record<VerificationType, SessionKey> = {
  [VerificationType.ChangeEmail]: 'changeEmail#transactionID',
  [VerificationType.ChangeEmailConfirmation]:
    'changeEmailConfirm#transactionID',
  [VerificationType.ChangePassword]: 'changePassword#transactionID',
  [VerificationType.Onboarding]: 'onboarding#transactionID',
  [VerificationType.ResetPassword]: 'resetPassword#transactionID',
  [VerificationType.TwoFactorAuth]: 'login2FA#transactionID',
  [VerificationType.TwoFactorAuthDisable]: 'disable2FA#transactionID',
  [VerificationType.TwoFactorAuthSetup]: 'enable2FA#transactionID',
} as const;

export const action = withErrorHandling(async (args: Route.ActionArgs) => {
  const { request } = args;

  const client = await createGQLClient(request);
  const formData = await request.formData();

  await checkHoneypot(formData);

  const submission = parseWithZod(formData, { schema: VerifyOTPFormSchema });

  if (submission.status !== 'success') {
    const result = submission.reply();
    const status = submission.status === 'error' ? 400 : 200;

    return data({ result }, { status });
  }

  const verifySession = await verifySessionStorage.getSession(
    request.headers.get('cookie'),
  );

  const authSession = await authSessionStorage.getSession(
    request.headers.get('cookie'),
  );

  const transactionID = verifySession.get(
    transactionIDKeys[submission.value.type],
  );

  const sessionID =
    verifySession.get('login2FA#sessionID') ?? authSession.get('sessionID');

  // if we don't have a transaction ID then we really shouldn't be here.
  if (!transactionID) {
    const result = submission.reply({
      formErrors: ['Something went wrong.'],
    });

    return data({ result }, { status: 400 });
  }

  const result = await client.mutation(VerifyOTPMutation, {
    input: {
      code: submission.value.code,
      sessionID,
      target: submission.value.target,
      transactionID,
      type: submission.value.type,
    },
  });

  if (result.error) {
    handleGQLError(result.error);

    const formResult = submission.reply({
      formErrors: ['Something went wrong'],
    });

    return data({ result: formResult }, { status: 500 });
  }

  invariant(result.data, 'if no error, there must be data');

  if (isMutationError(result.data.verifyOTP)) {
    const formResult = submission.reply({
      formErrors: [result.data.verifyOTP.error.message],
    });

    return data({ result: formResult }, { status: 400 });
  }

  return await handleVerification(submission.value.type, {
    body: formData,
    client,
    request,
    submission,
    transactionToken: result.data.verifyOTP.transactionToken,
  });
});

export function VerifyOTPRoute(props: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const isFormPending = useIsFormPending();

  const typeParsedWithZod = VerificationTypeSchema.safeParse(
    searchParams.get(QueryParam.Type),
  );

  const type = typeParsedWithZod.success ? typeParsedWithZod.data : null;

  const [form, fields] = useForm({
    constraint: getZodConstraint(VerifyOTPFormSchema),
    defaultValue: {
      [QueryParam.Code]: searchParams.get(QueryParam.Code),
      [QueryParam.RedirectTo]: searchParams.get(QueryParam.RedirectTo),
      [QueryParam.Target]: searchParams.get(QueryParam.Target),
      [QueryParam.Type]: type,
    },
    id: 'verify-otp-form',
    lastResult: props.actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifyOTPFormSchema });
    },
  });

  const submitButtonStatus = isFormPending
    ? StatusButton.Status.Pending
    : StatusButton.Status.Idle;

  return (
    <main>
      <Form method="POST" {...getFormProps(form)}>
        <HoneypotInputs />
        <OTPField
          errors={fields[QueryParam.Code].errors ?? []}
          inputProps={{
            ...getInputProps(fields[QueryParam.Code], { type: 'text' }),
            autoComplete: 'one-time-code',
            autoFocus: true,
          }}
          labelProps={{
            children: 'Code',
            htmlFor: fields[QueryParam.Code].id,
          }}
        />
        <input
          {...getInputProps(fields[QueryParam.Type], { type: 'hidden' })}
        />
        <input
          {...getInputProps(fields[QueryParam.Target], { type: 'hidden' })}
        />
        <input
          {...getInputProps(fields[QueryParam.RedirectTo], { type: 'hidden' })}
        />
        <StatusButton
          disabled={isFormPending}
          status={submitButtonStatus}
          type="submit"
        >
          Verify
        </StatusButton>
        <FormErrorList errors={form.errors ?? []} id={form.errorId} />
      </Form>
    </main>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default VerifyOTPRoute;
