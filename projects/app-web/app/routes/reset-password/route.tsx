import { data, Form, Link, redirect } from 'react-router';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import { z } from 'zod';
import { Field } from '~/components/field';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { StatusButton } from '~/components/status-button.tsx';
import { FinishPasswordResetMutation } from '~/data/mutations/finish-password-reset';
import { useIsFormPending } from '~/hooks/use-is-form-pending';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { checkHoneypot } from '~/utils/check-honeypot.server.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { handleGQLError } from '~/utils/handle-gql-error.ts';
import { isMutationError } from '~/utils/is-mutation-error';
import { requireAnonymous } from '~/utils/require-anonymous.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import { ConfirmPasswordSchema } from '~/validation/confirm-password-schema.ts';
import type { Route } from './+types/route.ts';

const ResetPasswordFormSchema = z.intersection(
  z.object({
    email: z.string(),
  }),
  ConfirmPasswordSchema,
);

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: 'Vers | Reset Password',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  const { request } = args;

  await requireAnonymous(request);

  const url = new URL(request.url);
  const resetToken = url.searchParams.get('token');
  const email = url.searchParams.get('email');

  if (!resetToken || !email) {
    return redirect(Routes.Login);
  }

  return { email };
});

export const action = withErrorHandling(async (args: Route.ActionArgs) => {
  const { request } = args;

  await requireAnonymous(request);

  const url = new URL(request.url);
  const resetToken = url.searchParams.get('token');
  const email = url.searchParams.get('email');

  if (!resetToken || !email) {
    return redirect(Routes.Login);
  }

  const client = await createGQLClient(request);
  const formData = await request.formData();

  await checkHoneypot(formData);

  const submission = parseWithZod(formData, {
    schema: ResetPasswordFormSchema,
  });

  if (submission.status !== 'success') {
    const result = submission.reply();
    const status = submission.status === 'error' ? 400 : 200;

    return data({ result }, { status });
  }

  const verifySession = await verifySessionStorage.getSession(
    request.headers.get('cookie'),
  );

  // attach our transaction token incase 2FA was required for this reset
  const transactionToken = verifySession.get('resetPassword#transactionToken');

  const result = await client.mutation(FinishPasswordResetMutation, {
    input: {
      email,
      password: submission.value.password,
      resetToken,
      transactionToken,
    },
  });

  if (result.error) {
    handleGQLError(result.error);

    const formResult = submission.reply({
      formErrors: ['Something went wrong'],
    });

    return data({ result: formResult }, { status: 500 });
  }

  if (isMutationError(result.data?.finishPasswordReset)) {
    const formResult = submission.reply({
      formErrors: [result.data.finishPasswordReset.error.message],
    });

    return data({ result: formResult }, { status: 400 });
  }

  // clean up our session data
  verifySession.unset('resetPassword#transactionToken');

  // Clear the verification session since we're done with it
  return redirect(Routes.Login, {
    headers: {
      'set-cookie': await verifySessionStorage.commitSession(verifySession),
    },
  });
});

export function ResetPassword(props: Route.ComponentProps) {
  const isFormPending = useIsFormPending();

  const [form, fields] = useForm({
    constraint: getZodConstraint(ResetPasswordFormSchema),
    defaultValue: {
      email: props.loaderData.email,
    },
    id: 'reset-password-form',
    lastResult: props.actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ResetPasswordFormSchema });
    },
    shouldRevalidate: 'onBlur',
  });

  const submitButtonStatus = isFormPending
    ? StatusButton.Status.Pending
    : StatusButton.Status.Idle;

  return (
    <main>
      <div>
        <h1>Reset Password</h1>
        <p>Please enter your new password</p>
      </div>

      <Form method="POST" {...getFormProps(form)}>
        <HoneypotInputs />
        <input {...getInputProps(fields.email, { type: 'hidden' })} />
        <Field
          errors={fields.password.errors ?? []}
          inputProps={{
            ...getInputProps(fields.password, { type: 'password' }),
            autoComplete: 'new-password',
          }}
          labelProps={{
            children: 'New Password',
            htmlFor: fields.password.id,
          }}
        />
        <Field
          errors={fields.confirmPassword.errors ?? []}
          inputProps={{
            ...getInputProps(fields.confirmPassword, { type: 'password' }),
            autoComplete: 'new-password',
          }}
          labelProps={{
            children: 'Confirm Password',
            htmlFor: fields.confirmPassword.id,
          }}
        />
        <FormErrorList errors={form.errors ?? []} id={form.errorId} />
        <StatusButton
          disabled={isFormPending}
          status={submitButtonStatus}
          type="submit"
        >
          Reset Password
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

export default ResetPassword;
