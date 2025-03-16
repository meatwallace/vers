import { data, Form, Link, redirect } from 'react-router';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { Field } from '~/components/field';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { StatusButton } from '~/components/status-button.tsx';
import { StartPasswordResetMutation } from '~/data/mutations/start-password-reset';
import { useIsFormPending } from '~/hooks/use-is-form-pending';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { checkHoneypot } from '~/utils/check-honeypot.server.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { handleGQLError } from '~/utils/handle-gql-error.ts';
import { is2FARequiredPayload } from '~/utils/is-2fa-required-payload.ts';
import { isMutationError } from '~/utils/is-mutation-error.ts';
import { requireAnonymous } from '~/utils/require-anonymous.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import { UserEmailSchema } from '~/validation/user-email-schema.ts';
import type { Route } from './+types/route.ts';

const ForgotPasswordFormSchema = z.object({
  email: UserEmailSchema,
});

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: 'Vers | Forgot Password',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  const { request } = args;

  await requireAnonymous(request);

  return null;
});

export const action = withErrorHandling(async (args: Route.ActionArgs) => {
  const { request } = args;

  await requireAnonymous(request);

  const client = await createGQLClient(request);
  const formData = await request.formData();

  await checkHoneypot(formData);

  const submission = parseWithZod(formData, {
    schema: ForgotPasswordFormSchema,
  });

  if (submission.status !== 'success') {
    const result = submission.reply();
    const status = submission.status === 'error' ? 400 : 200;

    return data({ result }, { status });
  }

  const result = await client.mutation(StartPasswordResetMutation, {
    input: {
      email: submission.value.email,
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

  if (isMutationError(result.data.startPasswordReset)) {
    const formResult = submission.reply({
      formErrors: [result.data.startPasswordReset.error.message],
    });

    return data({ result: formResult }, { status: 400 });
  }

  if (is2FARequiredPayload(result.data.startPasswordReset)) {
    const verifySession = await verifySessionStorage.getSession(
      request.headers.get('cookie'),
    );

    verifySession.set(
      'resetPassword#transactionID',
      result.data.startPasswordReset.transactionID,
    );

    return redirect(Routes.ResetPasswordStarted, {
      headers: {
        'set-cookie': await verifySessionStorage.commitSession(verifySession),
      },
    });
  }

  return redirect(Routes.ResetPasswordStarted);
});

export function ForgotPassword(props: Route.ComponentProps) {
  const isFormPending = useIsFormPending();

  const [form, fields] = useForm({
    constraint: getZodConstraint(ForgotPasswordFormSchema),
    id: 'forgot-password-form',
    lastResult: props.actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ForgotPasswordFormSchema });
    },
    shouldRevalidate: 'onBlur',
  });

  const submitButtonStatus = isFormPending
    ? StatusButton.Status.Pending
    : StatusButton.Status.Idle;

  return (
    <main>
      <div>
        <h1>Forgot Password</h1>
        <p>No worries, we&apos;ll send you reset instructions.</p>
      </div>

      <Form method="POST" {...getFormProps(form)}>
        <HoneypotInputs />
        <Field
          errors={fields.email.errors ?? []}
          inputProps={{
            ...getInputProps(fields.email, { type: 'email' }),
            autoComplete: 'email',
          }}
          labelProps={{ children: 'Email', htmlFor: fields.email.id }}
        />
        <FormErrorList errors={form.errors ?? []} id={form.errorId} />
        <StatusButton
          disabled={isFormPending}
          status={submitButtonStatus}
          type="submit"
        >
          Recover password
        </StatusButton>
        <div>
          <span>Remember your password?</span>
          <Link to={Routes.Login}>Login</Link>
        </div>
      </Form>
    </main>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default ForgotPassword;
