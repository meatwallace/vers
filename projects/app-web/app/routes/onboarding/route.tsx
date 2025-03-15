import { data, Form, redirect } from 'react-router';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { CheckboxField, Field } from '~/components/field';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { StatusButton } from '~/components/status-button.tsx';
import { FinishEmailSignupMutation } from '~/data/mutations/finish-email-signup';
import { useIsFormPending } from '~/hooks/use-is-form-pending';
import { authSessionStorage } from '~/session/auth-session-storage.server.ts';
import { storeAuthPayload } from '~/session/store-auth-payload.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { checkHoneypot } from '~/utils/check-honeypot.server.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { handleGQLError } from '~/utils/handle-gql-error.ts';
import { isMutationError } from '~/utils/is-mutation-error';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import { ConfirmPasswordSchema } from '~/validation/confirm-password-schema.ts';
import { NameSchema } from '~/validation/name-schema.ts';
import { UsernameSchema } from '~/validation/username-schema.ts';
import type { Route } from './+types/route.ts';
import { requireOnboardingSession } from './require-onboarding-session.server.ts';

const OnboardingFormSchema = z
  .object({
    agreeToTerms: z.boolean({
      required_error:
        'You must agree to the terms of service and privacy policy',
    }),
    name: NameSchema,
    rememberMe: z.boolean().default(false),
    username: UsernameSchema,
  })
  .and(ConfirmPasswordSchema);

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: 'Vers | Onboarding',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  const { request } = args;

  const { email } = await requireOnboardingSession(request);

  return { email };
});

export const action = withErrorHandling(async (args: Route.ActionArgs) => {
  const { request } = args;

  const { email, transactionToken } = await requireOnboardingSession(request);

  const client = await createGQLClient(request);

  const formData = await request.formData();

  await checkHoneypot(formData);

  const submission = parseWithZod(formData, { schema: OnboardingFormSchema });

  if (submission.status !== 'success') {
    const result = submission.reply();
    const status = submission.status === 'error' ? 400 : 200;

    return data({ result }, { status });
  }

  const result = await client.mutation(FinishEmailSignupMutation, {
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
    request.headers.get('cookie'),
  );

  storeAuthPayload(authSession, result.data.finishEmailSignup);

  const verifySession = await verifySessionStorage.getSession();

  const headers = new Headers();

  headers.append(
    'set-cookie',
    await authSessionStorage.commitSession(authSession, {
      expires: new Date(result.data.finishEmailSignup.session.expiresAt),
    }),
  );

  headers.append(
    'set-cookie',
    await verifySessionStorage.destroySession(verifySession),
  );

  return redirect(Routes.Dashboard, { headers });
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
    <main>
      <Form method="POST" {...getFormProps(form)}>
        <HoneypotInputs />
        <Field
          errors={fields.username.errors ?? []}
          inputProps={{
            ...getInputProps(fields.username, { type: 'text' }),
            autoComplete: 'username',
          }}
          labelProps={{ children: 'Username', htmlFor: fields.username.id }}
        />
        <Field
          errors={fields.name.errors ?? []}
          inputProps={{
            ...getInputProps(fields.name, { type: 'text' }),
            autoComplete: 'name',
          }}
          labelProps={{ children: 'Name', htmlFor: fields.name.id }}
        />
        <Field
          errors={fields.password.errors ?? []}
          inputProps={{
            ...getInputProps(fields.password, { type: 'password' }),
            autoComplete: 'new-password',
          }}
          labelProps={{
            children: 'Password',
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
        <CheckboxField
          checkboxProps={getInputProps(fields.agreeToTerms, {
            type: 'checkbox',
          })}
          errors={fields.agreeToTerms.errors ?? []}
          labelProps={{
            children: 'Agree to terms',
            htmlFor: fields.agreeToTerms.id,
          }}
        />
        <CheckboxField
          checkboxProps={getInputProps(fields.rememberMe, {
            type: 'checkbox',
          })}
          errors={fields.rememberMe.errors ?? []}
          labelProps={{
            children: 'Remember me',
            htmlFor: fields.rememberMe.id,
          }}
        />
        <FormErrorList errors={form.errors ?? []} id={form.errorId} />
        <StatusButton
          disabled={isFormPending}
          status={submitButtonStatus}
          type="submit"
        >
          Create an account
        </StatusButton>
      </Form>
    </main>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default Onboarding;
