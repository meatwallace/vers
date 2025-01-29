import { data, redirect, Form } from 'react-router';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import { z } from 'zod';
import { useForm, getFormProps, getInputProps } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { type Route } from './+types/signup.ts';
import { graphql } from '~/gql';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { Field } from '~/components/field';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { StatusButton } from '~/components/status-button.tsx';
import { VerificationType } from '~/gql/graphql.ts';
import { useIsFormPending } from '~/hooks/use-is-form-pending.ts';
import { checkHoneypot } from '~/utils/check-honeypot.server.ts';
import { getDomainURL } from '~/utils/get-domain-url.ts';
import { isMutationError } from '~/utils/is-mutation-error.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { UserEmailSchema } from '~/validation/user-email-schema.ts';
import { Routes } from '~/types.ts';
import { requireAnonymous } from '~/utils/require-anonymous.server.ts';
import { QueryParam } from './verify-otp/verify-otp.tsx';

const startEmailSignupMutation = graphql(/* GraphQL */ `
  mutation StartEmailSignup($input: StartEmailSignupInput!) {
    startEmailSignup(input: $input) {
      ... on MutationSuccess {
        success
      }

      ... on MutationErrorPayload {
        error {
          message
        }
      }
    }
  }
`);

const SignupFormSchema = z.object({
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

  const submission = parseWithZod(formData, { schema: SignupFormSchema });

  if (submission.status !== 'success') {
    const result = submission.reply();
    const status = submission.status === 'error' ? 400 : 200;

    return data({ result }, { status });
  }

  try {
    const { startEmailSignup } = await client.request(
      startEmailSignupMutation,
      {
        input: {
          email: submission.value.email,
        },
      },
    );

    if (isMutationError(startEmailSignup)) {
      const result = submission.reply({
        formErrors: [startEmailSignup.error.message],
      });

      return data({ result }, { status: 500 });
    }

    const verifyURL = new URL(`${getDomainURL(request)}${Routes.VerifyOTP}`);

    verifyURL.searchParams.set(QueryParam.Type, VerificationType.Onboarding);
    verifyURL.searchParams.set(QueryParam.Target, submission.value.email);

    return redirect(verifyURL.toString());
  } catch (error) {
    // TODO(#16): capture error
    console.error('error', error);
  }

  const result = submission.reply({
    formErrors: ['Something went wrong'],
  });

  return data({ result }, { status: 500 });
}

export const meta: Route.MetaFunction = () => {
  return [{ title: 'Signup' }];
};

export function Signup({ actionData }: Route.ComponentProps) {
  const isFormPending = useIsFormPending();

  const [form, fields] = useForm({
    id: 'signup-form',
    constraint: getZodConstraint(SignupFormSchema),
    lastResult: actionData?.result,
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
          labelProps={{ htmlFor: fields.email.id, children: 'Email' }}
          inputProps={{
            ...getInputProps(fields.email, { type: 'email' }),
            autoFocus: true,
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
