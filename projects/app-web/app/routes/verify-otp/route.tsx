import { Form, data, redirect, useSearchParams } from 'react-router';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import { z } from 'zod';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { OTPField } from '~/components/field/index.ts';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { StatusButton } from '~/components/status-button.tsx';
import { VerifyOTP } from '~/data/mutations/verify-otp.ts';
import { VerificationType } from '~/gql/graphql.ts';
import { useIsFormPending } from '~/hooks/use-is-form-pending.ts';
import { authSessionStorage } from '~/session/auth-session-storage.server.ts';
import {
  SESSION_KEY_AUTH_ACCESS_TOKEN,
  SESSION_KEY_AUTH_SESSION_ID,
  SESSION_KEY_VERIFY_TRANSACTION_ID,
  SESSION_KEY_VERIFY_UNVERIFIED_SESSION_ID,
} from '~/session/consts.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { checkHoneypot } from '~/utils/check-honeypot.server.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { isMutationError } from '~/utils/is-mutation-error.ts';
import { Route } from './+types/route.ts';
import { handleVerification } from './handle-verification.server.ts';
import { QueryParam } from './types.ts';

const VerificationTypeSchema = z.nativeEnum(VerificationType);

export const VerifyOTPFormSchema = z.object({
  [QueryParam.Code]: z.string().length(6, 'Invalid code'),
  [QueryParam.Target]: z.string().min(1),
  [QueryParam.Type]: VerificationTypeSchema,
  [QueryParam.RedirectTo]: z.string().optional(),
});

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const typeParsedWithZod = VerificationTypeSchema.safeParse(
    url.searchParams.get(QueryParam.Type),
  );

  if (!typeParsedWithZod.success) {
    // TODO(#16): capture invalid verify type
    return redirect(Routes.Signup);
  }

  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const client = createGQLClient();

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

  const sessionID =
    verifySession.get(SESSION_KEY_VERIFY_UNVERIFIED_SESSION_ID) ??
    authSession.get(SESSION_KEY_AUTH_SESSION_ID);
  const accessToken = authSession.get(SESSION_KEY_AUTH_ACCESS_TOKEN);
  const transactionID = verifySession.get(SESSION_KEY_VERIFY_TRANSACTION_ID);

  if (sessionID) {
    client.setHeader('x-session-id', sessionID);
  }

  if (accessToken) {
    client.setHeader('authorization', `Bearer ${accessToken}`);
  }

  // if we don't have a transaction ID then we really shouldn't be here.
  if (!transactionID) {
    const result = submission.reply({
      formErrors: ['Something went wrong.'],
    });

    return data({ result }, { status: 400 });
  }

  try {
    const { verifyOTP } = await client.request(VerifyOTP, {
      input: {
        code: submission.value.code,
        target: submission.value.target,
        type: submission.value.type,
        transactionID,
        sessionID,
      },
    });

    if (isMutationError(verifyOTP)) {
      const result = submission.reply({
        formErrors: [verifyOTP.error.message],
      });

      return data({ result }, { status: 400 });
    }

    return await handleVerification(submission.value.type, {
      client,
      request,
      submission,
      transactionToken: verifyOTP.transactionToken,
      body: formData,
    });
  } catch (error) {
    // TODO(#16): capture error
    console.error('error', error);
  }

  const result = submission.reply({
    formErrors: ['Something went wrong'],
  });

  return data({ result }, { status: 500 });
}

export function VerifyOTPRoute({ actionData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const isFormPending = useIsFormPending();

  const typeParsedWithZod = VerificationTypeSchema.safeParse(
    searchParams.get(QueryParam.Type),
  );

  const type = typeParsedWithZod.success ? typeParsedWithZod.data : null;

  const [form, fields] = useForm({
    id: 'verify-otp-form',
    constraint: getZodConstraint(VerifyOTPFormSchema),
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifyOTPFormSchema });
    },
    defaultValue: {
      [QueryParam.Code]: searchParams.get(QueryParam.Code),
      [QueryParam.Target]: searchParams.get(QueryParam.Target),
      [QueryParam.Type]: type,
      [QueryParam.RedirectTo]: searchParams.get(QueryParam.RedirectTo),
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
          labelProps={{
            htmlFor: fields[QueryParam.Code].id,
            children: 'Code',
          }}
          inputProps={{
            ...getInputProps(fields[QueryParam.Code], { type: 'text' }),
            autoComplete: 'one-time-code',
            autoFocus: true,
          }}
          errors={fields[QueryParam.Code].errors ?? []}
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
          type="submit"
          status={submitButtonStatus}
          disabled={isFormPending}
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
