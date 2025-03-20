import {
  data,
  Form,
  redirect,
  Link as RRLink,
  useSearchParams,
} from 'react-router';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import {
  Brand,
  CheckboxField,
  Field,
  Heading,
  Link,
  StatusButton,
  Text,
} from '@vers/design-system';
import { css } from '@vers/styled-system/css';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import { safeRedirect } from 'remix-utils/safe-redirect';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { LoginWithPasswordMutation } from '~/data/mutations/login-with-password';
import { VerificationType } from '~/gql/graphql.ts';
import { useIsFormPending } from '~/hooks/use-is-form-pending';
import { authSessionStorage } from '~/session/auth-session-storage.server.ts';
import { storeAuthPayload } from '~/session/store-auth-payload.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { checkHoneypot } from '~/utils/check-honeypot.server.ts';
import { getDomainURL } from '~/utils/get-domain-url.ts';
import { handleGQLError } from '~/utils/handle-gql-error.ts';
import { is2FARequiredPayload } from '~/utils/is-2fa-required-payload.ts';
import { isMutationError } from '~/utils/is-mutation-error';
import { requireAnonymous } from '~/utils/require-anonymous.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import { FormBooleanSchema } from '~/validation/form-boolean-schema.ts';
import { PasswordSchema } from '~/validation/password-schema.ts';
import { UserEmailSchema } from '~/validation/user-email-schema.ts';
import type { Route } from './+types/route.ts';
import { QueryParam } from '../verify-otp/types.ts';

const LoginFormSchema = z.object({
  email: UserEmailSchema,
  password: PasswordSchema,
  redirect: z.string().optional(),
  rememberMe: FormBooleanSchema.default('off'),
});

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: 'vers | Login',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  await requireAnonymous(args.request);
});

export const action = withErrorHandling(async (args: Route.ActionArgs) => {
  await requireAnonymous(args.request);

  const formData = await args.request.formData();

  await checkHoneypot(formData);

  const submission = parseWithZod(formData, { schema: LoginFormSchema });

  if (submission.status !== 'success') {
    const result = submission.reply();
    const status = submission.status === 'error' ? 400 : 200;

    return data({ result }, { status });
  }

  const result = await args.context.client.mutation(LoginWithPasswordMutation, {
    input: {
      email: submission.value.email,
      password: submission.value.password,
      rememberMe: submission.value.rememberMe,
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

  if (isMutationError(result.data.loginWithPassword)) {
    const formResult = submission.reply({
      formErrors: [result.data.loginWithPassword.error.message],
    });

    return data({ result: formResult }, { status: 400 });
  }

  if (is2FARequiredPayload(result.data.loginWithPassword)) {
    const verifyURL = new URL(
      `${getDomainURL(args.request)}${Routes.VerifyOTP}`,
    );

    verifyURL.searchParams.set(QueryParam.Target, submission.value.email);
    verifyURL.searchParams.set(QueryParam.Type, VerificationType.TwoFactorAuth);

    if (submission.value.redirect) {
      verifyURL.searchParams.set(
        QueryParam.RedirectTo,
        submission.value.redirect,
      );
    }

    invariant(result.data.loginWithPassword.sessionID, 'sessionID is required');

    const verifySession = await verifySessionStorage.getSession(
      args.request.headers.get('cookie'),
    );

    verifySession.set(
      'login2FA#sessionID',
      result.data.loginWithPassword.sessionID,
    );

    verifySession.set(
      'login2FA#transactionID',
      result.data.loginWithPassword.transactionID,
    );

    return redirect(verifyURL.toString(), {
      headers: {
        'set-cookie': await verifySessionStorage.commitSession(verifySession),
      },
    });
  }

  const authSession = await authSessionStorage.getSession(
    args.request.headers.get('cookie'),
  );

  storeAuthPayload(authSession, result.data.loginWithPassword);

  return redirect(safeRedirect(submission.value.redirect ?? Routes.Dashboard), {
    headers: {
      'set-cookie': await authSessionStorage.commitSession(authSession, {
        expires: new Date(result.data.loginWithPassword.session.expiresAt),
      }),
    },
  });
});

const pageInfo = css({
  marginBottom: '8',
  textAlign: 'center',
});

const formStyles = css({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '6',
  width: '96',
});

const forgotPasswordLink = css({
  alignSelf: 'flex-end',
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
    <>
      <section className={pageInfo}>
        <RRLink to={Routes.Index}>
          <Brand size="xl" />
        </RRLink>
        <Heading level={2}>Welcome back</Heading>
        <Text>Please enter your details to login</Text>
      </section>
      <Form method="POST" {...getFormProps(form)} className={formStyles}>
        <HoneypotInputs />
        <Field
          errors={fields.email.errors ?? []}
          inputProps={{
            ...getInputProps(fields.email, { type: 'email' }),
            autoComplete: 'email',
            placeholder: 'your.email@example.com',
          }}
          labelProps={{ children: 'Email' }}
        />
        <Field
          errors={fields.password.errors ?? []}
          inputProps={{
            ...getInputProps(fields.password, { type: 'password' }),
            autoComplete: 'current-password',
            placeholder: '********',
          }}
          labelProps={{ children: 'Password' }}
        />
        <input {...getInputProps(fields.redirect, { type: 'hidden' })} />
        <CheckboxField
          checkboxProps={getInputProps(fields.rememberMe, { type: 'checkbox' })}
          errors={fields.rememberMe.errors ?? []}
          labelProps={{ children: 'Remember me' }}
        />
        <FormErrorList errors={form.errors ?? []} id={form.errorId} />
        <StatusButton
          disabled={isFormPending}
          status={submitButtonStatus}
          type="submit"
          variant="primary"
          fullWidth
        >
          Login
        </StatusButton>
        <Link className={forgotPasswordLink} to={Routes.ForgotPassword}>
          Forgot your password?
        </Link>
      </Form>
      <Text>Don&apos;t have an account?</Text>
      <Link to={Routes.Signup}>Signup</Link>
    </>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default Login;
