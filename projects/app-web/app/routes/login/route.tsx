import { data, Form, Link, redirect, useSearchParams } from 'react-router';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import { safeRedirect } from 'remix-utils/safe-redirect';
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
import { storeAuthPayload } from '~/session/store-auth-payload.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { checkHoneypot } from '~/utils/check-honeypot.server.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { getDomainURL } from '~/utils/get-domain-url.ts';
import { is2FARequiredPayload } from '~/utils/is-2fa-required-payload.ts';
import { isMutationError } from '~/utils/is-mutation-error';
import { requireAnonymous } from '~/utils/require-anonymous.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import { PasswordSchema } from '~/validation/password-schema.ts';
import { UserEmailSchema } from '~/validation/user-email-schema.ts';
import type { Route } from './+types/route.ts';
import { QueryParam } from '../verify-otp/types.ts';
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
  redirect: z.string().optional(),
  rememberMe: z.boolean().default(false),
});

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: 'Vers | Login',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  const { request } = args;

  await requireAnonymous(request);
});

export const action = withErrorHandling(async (args: Route.ActionArgs) => {
  const { request } = args;

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
    verifyURL.searchParams.set(QueryParam.Type, VerificationType.TwoFactorAuth);

    if (submission.value.redirect) {
      verifyURL.searchParams.set(
        QueryParam.RedirectTo,
        submission.value.redirect,
      );
    }

    invariant(loginWithPassword.sessionID, 'sessionID is required');

    const verifySession = await verifySessionStorage.getSession(
      request.headers.get('cookie'),
    );

    verifySession.set('unverifiedSessionID', loginWithPassword.sessionID);
    verifySession.set('transactionID', loginWithPassword.transactionID);

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

  return redirect(safeRedirect(submission.value.redirect ?? Routes.Dashboard), {
    headers: {
      'set-cookie': await authSessionStorage.commitSession(authSession, {
        expires: new Date(loginWithPassword.session.expiresAt),
      }),
    },
  });
});

export function Login(props: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const isFormPending = useIsFormPending();

  const [form, fields] = useForm({
    constraint: getZodConstraint(LoginFormSchema),
    defaultValue: {
      redirect: searchParams.get('redirect'),
    },
    id: 'login-form',
    lastResult: props.actionData?.result,
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
        <input {...getInputProps(fields.redirect, { type: 'hidden' })} />
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
