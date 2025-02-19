import invariant from 'tiny-invariant';
import { z } from 'zod';
import { data, redirect, Form, Link, Session } from 'react-router';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import { useForm, getFormProps, getInputProps } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { type Route } from './+types/reset-password';
import { graphql } from '~/gql';
import { Routes } from '~/types.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { Field } from '~/components/field';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { StatusButton } from '~/components/status-button.tsx';
import { useIsFormPending } from '~/hooks/use-is-form-pending';
import { checkHoneypot } from '~/utils/check-honeypot.server.ts';
import { isMutationError } from '~/utils/is-mutation-error';
import { requireAnonymous } from '~/utils/require-anonymous.server.ts';
import { ConfirmPasswordSchema } from '~/validation/confirm-password-schema.ts';
import {
  SESSION_KEY_VERIFY_RESET_PASSWORD_EMAIL,
  SESSION_KEY_VERIFY_RESET_PASSWORD_TOKEN,
} from '~/session/consts.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import * as styles from './reset-password.css.ts';

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

  const verifySession = await verifySessionStorage.getSession(
    request.headers.get('cookie'),
  );

  if (!isValidResetPasswordRequest(request, verifySession)) {
    return redirect(Routes.Login);
  }

  const email = verifySession.get(SESSION_KEY_VERIFY_RESET_PASSWORD_EMAIL);

  return { email };
}

export async function action({ request }: Route.ActionArgs) {
  await requireAnonymous(request);

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

  const verifySession = await verifySessionStorage.getSession(
    request.headers.get('cookie'),
  );

  if (!isValidResetPasswordRequest(request, verifySession)) {
    const result = submission.reply({
      formErrors: ['Invalid request'],
    });

    return data({ result }, { status: 400 });
  }

  try {
    const resetPasswordToken = verifySession.get(
      SESSION_KEY_VERIFY_RESET_PASSWORD_TOKEN,
    );

    invariant(resetPasswordToken, 'reset password token is required');

    const { finishPasswordReset } = await client.request(
      finishPasswordResetMutation,
      {
        input: {
          resetToken: resetPasswordToken,
          email: submission.value.email,
          password: submission.value.password,
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
    id: 'reset-password-form',
    constraint: getZodConstraint(ResetPasswordFormSchema),
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ResetPasswordFormSchema });
    },
    shouldRevalidate: 'onBlur',
    defaultValue: {
      email: loaderData.email,
    },
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
          labelProps={{
            htmlFor: fields.password.id,
            children: 'New Password',
          }}
          inputProps={{
            ...getInputProps(fields.password, { type: 'password' }),
            autoComplete: 'new-password',
          }}
          errors={fields.password.errors ?? []}
        />
        <Field
          labelProps={{
            htmlFor: fields.confirmPassword.id,
            children: 'Confirm Password',
          }}
          inputProps={{
            ...getInputProps(fields.confirmPassword, { type: 'password' }),
            autoComplete: 'new-password',
          }}
          errors={fields.confirmPassword.errors ?? []}
        />
        <FormErrorList errors={form.errors ?? []} id={form.errorId} />
        <StatusButton
          type="submit"
          status={submitButtonStatus}
          disabled={isFormPending}
        >
          Reset Password
        </StatusButton>
        <div className={styles.loginContainer}>
          <span className={styles.loginText}>Remember your password?</span>
          <Link to={Routes.Login} className={styles.loginLink}>
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

function isValidResetPasswordRequest(request: Request, session: Session) {
  const url = new URL(request.url);
  const resetToken = url.searchParams.get('token');

  const resetPasswordEmail = session.get(
    SESSION_KEY_VERIFY_RESET_PASSWORD_EMAIL,
  );

  const resetPasswordToken = session.get(
    SESSION_KEY_VERIFY_RESET_PASSWORD_TOKEN,
  );

  return (
    // require reset token to be present in params
    resetToken &&
    // require email and reset token to be present in the session
    resetPasswordEmail &&
    resetPasswordToken &&
    // require the email and reset token to match the session values
    resetPasswordToken === resetToken
  );
}

export default ResetPassword;
