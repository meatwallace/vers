import { data, Form, redirect, Link as RRLink } from 'react-router';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import {
  Brand,
  CheckboxField,
  Field,
  Heading,
  StatusButton,
  Text,
} from '@vers/design-system';
import { css } from '@vers/styled-system/css';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { FinishEmailSignupMutation } from '~/data/mutations/finish-email-signup';
import { useIsFormPending } from '~/hooks/use-is-form-pending';
import { authSessionStorage } from '~/session/auth-session-storage.server.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { checkHoneypot } from '~/utils/check-honeypot.server.ts';
import { handleGQLError } from '~/utils/handle-gql-error.ts';
import { isMutationError } from '~/utils/is-mutation-error';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import { ConfirmPasswordSchema } from '~/validation/confirm-password-schema.ts';
import { FormBooleanSchema } from '~/validation/form-boolean-schema.ts';
import { NameSchema } from '~/validation/name-schema.ts';
import { UsernameSchema } from '~/validation/username-schema.ts';
import type { Route } from './+types/route.ts';
import { requireOnboardingSession } from './require-onboarding-session.server.ts';

const OnboardingFormSchema = z
  .object({
    agreeToTerms: z
      .literal('on', {
        errorMap: () => ({
          message: 'You must agree to the terms of service and privacy policy',
        }),
      })
      .transform(Boolean),
    name: NameSchema,
    rememberMe: FormBooleanSchema.default('on'),
    username: UsernameSchema,
  })
  .and(ConfirmPasswordSchema);

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: 'vers | Onboarding',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  const { email } = await requireOnboardingSession(args.request);

  return { email };
});

export const action = withErrorHandling(async (args: Route.ActionArgs) => {
  const { email, transactionToken } = await requireOnboardingSession(
    args.request,
  );

  const formData = await args.request.formData();

  await checkHoneypot(formData);

  const submission = parseWithZod(formData, { schema: OnboardingFormSchema });

  if (submission.status !== 'success') {
    const result = submission.reply();
    const status = submission.status === 'error' ? 400 : 200;

    return data({ result }, { status });
  }

  const result = await args.context.client.mutation(FinishEmailSignupMutation, {
    input: {
      email,
      name: submission.value.name,
      password: submission.value.password,
      rememberMe: submission.value.rememberMe,
      transactionToken,
      username: submission.value.username,
    },
  });

  if (result.error) {
    handleGQLError(result.error);

    const formResult = submission.reply({
      formErrors: ['Something went wrong'],
    });

    return data({ result: formResult }, { status: 500 });
  }

  invariant(result.data, 'if no error, there should be data');

  if (isMutationError(result.data.finishEmailSignup)) {
    const formResult = submission.reply({
      formErrors: [result.data.finishEmailSignup.error.message],
    });

    return data({ result: formResult }, { status: 400 });
  }

  const authSession = await authSessionStorage.getSession(
    args.request.headers.get('cookie'),
  );

  authSession.set('sessionID', result.data.finishEmailSignup.session.id);
  authSession.set('accessToken', result.data.finishEmailSignup.accessToken);
  authSession.set('refreshToken', result.data.finishEmailSignup.refreshToken);

  const verifySession = await verifySessionStorage.getSession();

  // clean up our session data
  verifySession.unset('onboarding#transactionToken');
  verifySession.unset('onboarding#email');

  const headers = new Headers();

  headers.append(
    'set-cookie',
    await authSessionStorage.commitSession(authSession, {
      expires: new Date(result.data.finishEmailSignup.session.expiresAt),
    }),
  );

  headers.append(
    'set-cookie',
    await verifySessionStorage.commitSession(verifySession),
  );

  return redirect(Routes.Dashboard, { headers });
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

export function Onboarding(props: Route.ComponentProps) {
  const isFormPending = useIsFormPending();

  const [form, fields] = useForm({
    constraint: getZodConstraint(OnboardingFormSchema),
    id: 'onboarding-form',
    lastResult: props.actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: OnboardingFormSchema });
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
        <Heading level={2}>Welcome to vers</Heading>
        <Text>Please enter your details to create an account</Text>
      </section>
      <Form method="POST" {...getFormProps(form)} className={formStyles}>
        <HoneypotInputs />
        <Field
          errors={fields.username.errors ?? []}
          inputProps={{
            ...getInputProps(fields.username, { type: 'text' }),
            autoComplete: 'username',
            autoFocus: true,
            placeholder: 'john_smith13',
          }}
          labelProps={{ children: 'Username' }}
        />
        <Field
          errors={fields.name.errors ?? []}
          inputProps={{
            ...getInputProps(fields.name, { type: 'text' }),
            autoComplete: 'name',
            placeholder: 'John Smith',
          }}
          labelProps={{ children: 'Name' }}
        />
        <Field
          errors={fields.password.errors ?? []}
          inputProps={{
            ...getInputProps(fields.password, { type: 'password' }),
            autoComplete: 'new-password',
            placeholder: '********',
          }}
          labelProps={{ children: 'Password' }}
        />
        <Field
          errors={fields.confirmPassword.errors ?? []}
          inputProps={{
            ...getInputProps(fields.confirmPassword, { type: 'password' }),
            autoComplete: 'new-password',
            placeholder: '********',
          }}
          labelProps={{ children: 'Confirm Password' }}
        />
        <CheckboxField
          checkboxProps={getInputProps(fields.agreeToTerms, {
            type: 'checkbox',
          })}
          errors={fields.agreeToTerms.errors ?? []}
          labelProps={{ children: 'Agree to terms' }}
        />
        <CheckboxField
          checkboxProps={getInputProps(fields.rememberMe, {
            type: 'checkbox',
          })}
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
          Create an Account
        </StatusButton>
      </Form>
    </>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default Onboarding;
