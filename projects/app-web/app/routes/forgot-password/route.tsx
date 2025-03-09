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
import { SESSION_KEY_VERIFY_TRANSACTION_ID } from '~/session/consts.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { checkHoneypot } from '~/utils/check-honeypot.server.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { is2FARequiredPayload } from '~/utils/is-2fa-required-payload.ts';
import { isMutationError } from '~/utils/is-mutation-error.ts';
import { requireAnonymous } from '~/utils/require-anonymous.server.ts';
import { UserEmailSchema } from '~/validation/user-email-schema.ts';
import { type Route } from './+types/route.ts';
import * as styles from './route.css.ts';

const startPasswordResetMutation = graphql(/* GraphQL */ `
  mutation StartPasswordReset($input: StartPasswordResetInput!) {
    startPasswordReset(input: $input) {
      ... on MutationSuccess {
        success
      }

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

const ForgotPasswordFormSchema = z.object({
  email: UserEmailSchema,
});

export async function loader({ request }: Route.LoaderArgs) {
  await requireAnonymous(request);

  return null;
}

export async function action({ request }: Route.ActionArgs) {
  await requireAnonymous(request);

  const client = createGQLClient();

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

  try {
    const { startPasswordReset } = await client.request(
      startPasswordResetMutation,
      {
        input: {
          email: submission.value.email,
        },
      },
    );

    if (isMutationError(startPasswordReset)) {
      const result = submission.reply({
        formErrors: [startPasswordReset.error.message],
      });

      return data({ result }, { status: 400 });
    }

    if (is2FARequiredPayload(startPasswordReset)) {
      const verifySession = await verifySessionStorage.getSession(
        request.headers.get('cookie'),
      );

      verifySession.set(
        SESSION_KEY_VERIFY_TRANSACTION_ID,
        startPasswordReset.transactionID,
      );

      return redirect(Routes.ResetPasswordStarted, {
        headers: {
          'set-cookie': await verifySessionStorage.commitSession(verifySession),
        },
      });
    }

    return redirect(Routes.ResetPasswordStarted);
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
  return [{ title: 'Forgot Password' }];
};

export function ForgotPassword({ actionData }: Route.ComponentProps) {
  const isFormPending = useIsFormPending();

  const [form, fields] = useForm({
    constraint: getZodConstraint(ForgotPasswordFormSchema),
    id: 'forgot-password-form',
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ForgotPasswordFormSchema });
    },
    shouldRevalidate: 'onBlur',
  });

  const submitButtonStatus = isFormPending
    ? StatusButton.Status.Pending
    : StatusButton.Status.Idle;

  return (
    <main className={styles.forgotPasswordFormContainer}>
      <div className={styles.forgotPasswordHeader}>
        <h1 className={styles.forgotPasswordTitle}>Forgot Password</h1>
        <p className={styles.forgotPasswordSubtitle}>
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>

      <Form
        method="POST"
        {...getFormProps(form)}
        className={styles.forgotPasswordForm}
      >
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

export default ForgotPassword;
