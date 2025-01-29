import { z } from 'zod';
import { data, redirect, Form, Link } from 'react-router';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import { useForm, getFormProps, getInputProps } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { type Route } from './+types/login';
import { graphql } from '~/gql';
import { Routes } from '~/types.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { Field } from '~/components/field';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { StatusButton } from '~/components/status-button.tsx';
import { useIsFormPending } from '~/hooks/use-is-form-pending';
import { authSessionStorage } from '~/session/auth-session-storage.server.ts';
import { storeAuthPayload } from '~/session/store-auth-payload.ts';
import { checkHoneypot } from '~/utils/check-honeypot.server.ts';
import { isMutationError } from '~/utils/is-mutation-error';
import { requireAnonymous } from '~/utils/require-anonymous.server.ts';
import { UserEmailSchema } from '~/validation/user-email-schema.ts';
import { PasswordSchema } from '~/validation/password-schema.ts';
import * as styles from './login.css.ts';

const loginWithPasswordMutation = graphql(/* GraphQL */ `
  mutation LoginWithPassword($input: LoginWithPasswordInput!) {
    loginWithPassword(input: $input) {
      ... on AuthPayload {
        accessToken
        refreshToken
        session {
          id
          expiresAt
        }
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

const LoginFormSchema = z.object({
  email: UserEmailSchema,
  password: PasswordSchema,
  rememberMe: z.boolean().default(false),
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

  const submission = parseWithZod(formData, { schema: LoginFormSchema });

  if (submission.status !== 'success') {
    const result = submission.reply();
    const status = submission.status === 'error' ? 400 : 200;

    return data({ result }, { status });
  }

  try {
    const { loginWithPassword } = await client.request(
      loginWithPasswordMutation,
      {
        input: {
          email: submission.value.email,
          password: submission.value.password,
          rememberMe: submission.value.rememberMe,
        },
      },
    );

    if (isMutationError(loginWithPassword)) {
      const result = submission.reply({
        formErrors: [loginWithPassword.error.message],
      });

      return data({ result }, { status: 401 });
    }

    const authSession = await authSessionStorage.getSession(
      request.headers.get('cookie'),
    );

    storeAuthPayload(authSession, loginWithPassword);

    return redirect(Routes.Dashboard, {
      headers: {
        'set-cookie': await authSessionStorage.commitSession(authSession, {
          expires: new Date(loginWithPassword.session.expiresAt),
        }),
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
  return [{ title: 'Login' }];
};

export function Login({ actionData }: Route.ComponentProps) {
  const isFormPending = useIsFormPending();

  const [form, fields] = useForm({
    id: 'login-form',
    constraint: getZodConstraint(LoginFormSchema),
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginFormSchema });
    },
    shouldRevalidate: 'onBlur',
  });

  const submitButtonStatus = isFormPending
    ? StatusButton.Status.Pending
    : StatusButton.Status.Idle;

  return (
    <main className={styles.loginFormContainer}>
      <div className={styles.loginHeader}>
        <h1 className={styles.loginTitle}>Welcome back</h1>
        <p className={styles.loginSubtitle}>
          Please enter your details to sign in
        </p>
      </div>

      <Form method="POST" {...getFormProps(form)} className={styles.loginForm}>
        <HoneypotInputs />
        <Field
          labelProps={{ htmlFor: fields.email.id, children: 'Email' }}
          inputProps={{
            ...getInputProps(fields.email, { type: 'email' }),
            autoComplete: 'email',
          }}
          errors={fields.email.errors ?? []}
        />
        <Field
          labelProps={{
            htmlFor: fields.password.id,
            children: 'Password',
          }}
          inputProps={{
            ...getInputProps(fields.password, { type: 'password' }),
            autoComplete: 'current-password',
          }}
          errors={fields.password.errors ?? []}
        />
        <div className={styles.rememberMeContainer}>
          <Field
            labelProps={{
              htmlFor: fields.rememberMe.id,
              children: 'Remember me',
            }}
            inputProps={{
              ...getInputProps(fields.rememberMe, { type: 'checkbox' }),
            }}
            errors={fields.rememberMe.errors ?? []}
          />
        </div>
        <FormErrorList errors={form.errors ?? []} id={form.errorId} />
        <StatusButton
          type="submit"
          status={submitButtonStatus}
          disabled={isFormPending}
        >
          Sign in
        </StatusButton>
        <div className={styles.signupContainer}>
          <span className={styles.signupText}>Don't have an account?</span>
          <Link to={Routes.Signup} className={styles.signupLink}>
            Signup
          </Link>
        </div>
      </Form>
    </main>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default Login;
