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
import { graphql } from '~/gql';
import { VerificationType } from '~/gql/graphql.ts';
import { useIsFormPending } from '~/hooks/use-is-form-pending';
import { authSessionStorage } from '~/session/auth-session-storage.server.ts';
import {
  SESSION_KEY_VERIFY_TRANSACTION_ID,
  SESSION_KEY_VERIFY_UNVERIFIED_SESSION_ID,
} from '~/session/consts.ts';
import { storeAuthPayload } from '~/session/store-auth-payload.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { checkHoneypot } from '~/utils/check-honeypot.server.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { getDomainURL } from '~/utils/get-domain-url.ts';
import { is2FARequiredPayload } from '~/utils/is-2fa-required-payload.ts';
import { isMutationError } from '~/utils/is-mutation-error';
import { requireAnonymous } from '~/utils/require-anonymous.server.ts';
import { PasswordSchema } from '~/validation/password-schema.ts';
import { UserEmailSchema } from '~/validation/user-email-schema.ts';
import { QueryParam } from '../verify-otp/types.ts';
import { type Route } from './+types/route.ts';
import * as styles from './route.css.ts';

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

      ... on TwoFactorRequiredPayload {
        transactionID
        sessionID
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

    if (is2FARequiredPayload(loginWithPassword)) {
      const verifyURL = new URL(`${getDomainURL(request)}${Routes.VerifyOTP}`);

      verifyURL.searchParams.set(QueryParam.Target, submission.value.email);

      verifyURL.searchParams.set(
        QueryParam.Type,
        VerificationType.TwoFactorAuth,
      );

      invariant(loginWithPassword.sessionID, 'sessionID is required');

      const verifySession = await verifySessionStorage.getSession(
        request.headers.get('cookie'),
      );

      verifySession.set(
        SESSION_KEY_VERIFY_UNVERIFIED_SESSION_ID,
        loginWithPassword.sessionID,
      );

      verifySession.set(
        SESSION_KEY_VERIFY_TRANSACTION_ID,
        loginWithPassword.transactionID,
      );

      return redirect(verifyURL.toString(), {
        headers: {
          'set-cookie': await verifySessionStorage.commitSession(verifySession),
        },
      });
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
    constraint: getZodConstraint(LoginFormSchema),
    id: 'login-form',
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
          errors={fields.email.errors ?? []}
          inputProps={{
            ...getInputProps(fields.email, { type: 'email' }),
            autoComplete: 'email',
          }}
          labelProps={{ children: 'Email', htmlFor: fields.email.id }}
        />
        <Field
          errors={fields.password.errors ?? []}
          inputProps={{
            ...getInputProps(fields.password, { type: 'password' }),
            autoComplete: 'current-password',
          }}
          labelProps={{
            children: 'Password',
            htmlFor: fields.password.id,
          }}
        />
        <div className={styles.rememberMeContainer}>
          <Field
            errors={fields.rememberMe.errors ?? []}
            inputProps={{
              ...getInputProps(fields.rememberMe, { type: 'checkbox' }),
            }}
            labelProps={{
              children: 'Remember me',
              htmlFor: fields.rememberMe.id,
            }}
          />
          <Link
            className={styles.forgotPasswordLink}
            to={Routes.ForgotPassword}
          >
            Forgot password?
          </Link>
        </div>
        <FormErrorList errors={form.errors ?? []} id={form.errorId} />
        <StatusButton
          disabled={isFormPending}
          status={submitButtonStatus}
          type="submit"
        >
          Sign in
        </StatusButton>
        <div className={styles.signupContainer}>
          <span className={styles.signupText}>Don&apos;t have an account?</span>
          <Link className={styles.signupLink} to={Routes.Signup}>
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
