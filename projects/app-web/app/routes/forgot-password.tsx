import { z } from 'zod';
import { data, redirect, Form, Link } from 'react-router';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import { useForm, getFormProps, getInputProps } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { type Route } from './+types/forgot-password';
import { graphql } from '~/gql';
import { Routes } from '~/types.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { Field } from '~/components/field';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { StatusButton } from '~/components/status-button.tsx';
import { useIsFormPending } from '~/hooks/use-is-form-pending';
import { checkHoneypot } from '~/utils/check-honeypot.server.ts';
import { isMutationError } from '~/utils/is-mutation-error.ts';
import { requireAnonymous } from '~/utils/require-anonymous.server.ts';
import { UserEmailSchema } from '~/validation/user-email-schema.ts';
import * as styles from './forgot-password.css.ts';

const startPasswordResetMutation = graphql(/* GraphQL */ `
  mutation StartPasswordReset($input: StartPasswordResetInput!) {
    startPasswordReset(input: $input) {
      ... on MutationErrorPayload {
        error {
          title
          message
        }
      }

      ... on StartPasswordResetPayload {
        success
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
    id: 'forgot-password-form',
    constraint: getZodConstraint(ForgotPasswordFormSchema),
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
          No worries, we'll send you reset instructions.
        </p>
      </div>

      <Form
        method="POST"
        {...getFormProps(form)}
        className={styles.forgotPasswordForm}
      >
        <HoneypotInputs />
        <Field
          labelProps={{ htmlFor: fields.email.id, children: 'Email' }}
          inputProps={{
            ...getInputProps(fields.email, { type: 'email' }),
            autoComplete: 'email',
          }}
          errors={fields.email.errors ?? []}
        />
        <FormErrorList errors={form.errors ?? []} id={form.errorId} />
        <StatusButton
          type="submit"
          status={submitButtonStatus}
          disabled={isFormPending}
        >
          Recover password
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

export default ForgotPassword;
