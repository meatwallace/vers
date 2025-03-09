import { data, Form, Link, redirect } from 'react-router';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import { z } from 'zod';
import { Field } from '~/components/field';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { StatusButton } from '~/components/status-button.tsx';
import { graphql } from '~/gql';
import { useIsFormPending } from '~/hooks/use-is-form-pending';
import { SESSION_KEY_VERIFY_TRANSACTION_TOKEN } from '~/session/consts.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { checkHoneypot } from '~/utils/check-honeypot.server.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { isMutationError } from '~/utils/is-mutation-error';
import { requireAnonymous } from '~/utils/require-anonymous.server.ts';
import { ConfirmPasswordSchema } from '~/validation/confirm-password-schema.ts';
import { type Route } from './+types/route.ts';
import * as styles from './route.css.ts';

const finishPasswordResetMutation = graphql(/* GraphQL */ `
  mutation FinishPasswordReset($input: FinishPasswordResetInput!) {
    finishPasswordReset(input: $input) {
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

const ResetPasswordFormSchema = z.intersection(
  z.object({
    email: z.string(),
  }),
  ConfirmPasswordSchema,
);

export async function loader({ request }: Route.LoaderArgs) {
  await requireAnonymous(request);

  const url = new URL(request.url);
  const resetToken = url.searchParams.get('token');
  const email = url.searchParams.get('email');

  if (!resetToken || !email) {
    return redirect(Routes.Login);
  }

  return { email };
}

export async function action({ request }: Route.ActionArgs) {
  await requireAnonymous(request);

  const url = new URL(request.url);
  const resetToken = url.searchParams.get('token');
  const email = url.searchParams.get('email');

  if (!resetToken || !email) {
    return redirect(Routes.Login);
  }

  const client = createGQLClient();

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

  try {
    const verifySession = await verifySessionStorage.getSession(
      request.headers.get('cookie'),
    );

    // attach our transaction token incase 2FA was required for this reset
    const transactionToken = verifySession.get(
      SESSION_KEY_VERIFY_TRANSACTION_TOKEN,
    );

    const { finishPasswordReset } = await client.request(
      finishPasswordResetMutation,
      {
        input: {
          email,
          password: submission.value.password,
          resetToken,
          transactionToken,
        },
      },
    );

    if (isMutationError(finishPasswordReset)) {
      const result = submission.reply({
        formErrors: [finishPasswordReset.error.message],
      });

      return data({ result }, { status: 400 });
    }

    // Clear the verification session since we're done with it
    return redirect(Routes.Login, {
      headers: {
        'set-cookie': await verifySessionStorage.destroySession(verifySession),
      },
    });
  } catch (error) {
    // TODO(#16): capture error
    if (error instanceof Error) {
      console.error('error', error.message);
    }
  }

  const result = submission.reply({
    formErrors: ['Something went wrong'],
  });

  return data({ result }, { status: 500 });
}

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Reset Password' }];
};

export function ResetPassword({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const isFormPending = useIsFormPending();

  const [form, fields] = useForm({
    constraint: getZodConstraint(ResetPasswordFormSchema),
    defaultValue: {
      email: loaderData.email,
    },
    id: 'reset-password-form',
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ResetPasswordFormSchema });
    },
    shouldRevalidate: 'onBlur',
  });

  const submitButtonStatus = isFormPending
    ? StatusButton.Status.Pending
    : StatusButton.Status.Idle;

  return (
    <main className={styles.resetPasswordFormContainer}>
      <div className={styles.resetPasswordHeader}>
        <h1 className={styles.resetPasswordTitle}>Reset Password</h1>
        <p className={styles.resetPasswordSubtitle}>
          Please enter your new password
        </p>
      </div>

      <Form
        method="POST"
        {...getFormProps(form)}
        className={styles.resetPasswordForm}
      >
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
        <div className={styles.loginContainer}>
          <span className={styles.loginText}>Remember your password?</span>
          <Link className={styles.loginLink} to={Routes.Login}>
            Login
          </Link>
        </div>
      </Form>
    </main>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default ResetPassword;
