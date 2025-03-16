import { data, Form, redirect } from 'react-router';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { Field } from '~/components/field';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { StatusButton } from '~/components/status-button.tsx';
import { StartEmailSignupMutation } from '~/data/mutations/start-email-signup.ts';
import { VerificationType } from '~/gql/graphql.ts';
import { useIsFormPending } from '~/hooks/use-is-form-pending.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { checkHoneypot } from '~/utils/check-honeypot.server.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { getDomainURL } from '~/utils/get-domain-url.ts';
import { handleGQLError } from '~/utils/handle-gql-error.ts';
import { isMutationError } from '~/utils/is-mutation-error.ts';
import { requireAnonymous } from '~/utils/require-anonymous.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import { UserEmailSchema } from '~/validation/user-email-schema.ts';
import type { Route } from './+types/route.ts';
import { QueryParam } from '../verify-otp/types.ts';

const SignupFormSchema = z.object({
  email: UserEmailSchema,
});

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: 'Vers | Signup',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  const { request } = args;

  await requireAnonymous(request);

  return null;
});

export const action = withErrorHandling(async (args: Route.ActionArgs) => {
  const { request } = args;

  await requireAnonymous(request);

  const client = await createGQLClient(request);
  const formData = await request.formData();

  await checkHoneypot(formData);

  const submission = parseWithZod(formData, { schema: SignupFormSchema });

  if (submission.status !== 'success') {
    const result = submission.reply();
    const status = submission.status === 'error' ? 400 : 200;

    return data({ result }, { status });
  }

  const result = await client.mutation(StartEmailSignupMutation, {
    input: {
      email: submission.value.email,
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

  if (isMutationError(result.data.startEmailSignup)) {
    const formResult = submission.reply({
      formErrors: [result.data.startEmailSignup.error.message],
    });

    return data({ result: formResult }, { status: 400 });
  }

  const verifySession = await verifySessionStorage.getSession(
    request.headers.get('cookie'),
  );

  verifySession.set(
    'onboarding#transactionID',
    result.data.startEmailSignup.transactionID,
  );

  const verifyURL = new URL(`${getDomainURL(request)}${Routes.VerifyOTP}`);

  verifyURL.searchParams.set(QueryParam.Type, VerificationType.Onboarding);
  verifyURL.searchParams.set(QueryParam.Target, submission.value.email);

  return redirect(verifyURL.toString(), {
    headers: {
      'Set-Cookie': await verifySessionStorage.commitSession(verifySession),
    },
  });
});

export function Signup(props: Route.ComponentProps) {
  const isFormPending = useIsFormPending();

  const [form, fields] = useForm({
    constraint: getZodConstraint(SignupFormSchema),
    id: 'signup-form',
    lastResult: props.actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: SignupFormSchema });
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
          errors={fields.email.errors ?? []}
          inputProps={{
            ...getInputProps(fields.email, { type: 'email' }),
            autoComplete: 'email',
            autoFocus: true,
          }}
          labelProps={{ children: 'Email', htmlFor: fields.email.id }}
        />
        <FormErrorList errors={form.errors ?? []} id={form.errorId} />
        <StatusButton
          disabled={isFormPending}
          status={submitButtonStatus}
          type="submit"
        >
          Signup
        </StatusButton>
      </Form>
    </main>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default Signup;
