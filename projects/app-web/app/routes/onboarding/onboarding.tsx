import { z } from 'zod';
import { data, redirect, Form } from 'react-router';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import { useForm, getFormProps, getInputProps } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { type Route } from './+types/onboarding.ts';
import { graphql } from '~/gql';
import { Routes } from '~/types.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { CheckboxField, Field } from '~/components/field';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { StatusButton } from '~/components/status-button.tsx';
import { useIsFormPending } from '~/hooks/use-is-form-pending';
import { authSessionStorage } from '~/session/auth-session-storage.server.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { storeAuthPayload } from '~/session/store-auth-payload.ts';
import { ConfirmPasswordSchema } from '~/validation/confirm-password-schema.ts';
import { NameSchema } from '~/validation/name-schema.ts';
import { UsernameSchema } from '~/validation/username-schema.ts';
import { isMutationError } from '~/utils/is-mutation-error';
import { checkHoneypot } from '~/utils/check-honeypot.server.ts';
import { requireOnboardingEmail } from './require-onboarding-email.server.ts';

const finishEmailSignupMutation = graphql(/* GraphQL */ `
  mutation FinishEmailSignup($input: FinishEmailSignupInput!) {
    finishEmailSignup(input: $input) {
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

const OnboardingFormSchema = z
  .object({
    username: UsernameSchema,
    name: NameSchema,
    agreeToTerms: z.boolean({
      required_error:
        'You must agree to the terms of service and privacy policy',
    }),
    rememberMe: z.boolean().default(false),
  })
  .and(ConfirmPasswordSchema);

export async function loader({ request }: Route.LoaderArgs) {
  const email = await requireOnboardingEmail(request);

  return { email };
}

export async function action({ request }: Route.ActionArgs) {
  const client = createGQLClient();

  const email = await requireOnboardingEmail(request);
  const formData = await request.formData();

  await checkHoneypot(formData);

  const submission = parseWithZod(formData, { schema: OnboardingFormSchema });

  if (submission.status !== 'success') {
    const result = submission.reply();
    const status = submission.status === 'error' ? 400 : 200;

    return data({ result }, { status });
  }

  try {
    const { finishEmailSignup } = await client.request(
      finishEmailSignupMutation,
      {
        input: {
          email,
          username: submission.value.username,
          password: submission.value.password,
          name: submission.value.name,
          rememberMe: submission.value.rememberMe,
        },
      },
    );

    if (isMutationError(finishEmailSignup)) {
      const result = submission.reply({
        formErrors: [finishEmailSignup.error.message],
      });

      return data({ result }, { status: 500 });
    }

    const authSession = await authSessionStorage.getSession(
      request.headers.get('cookie'),
    );

    storeAuthPayload(authSession, finishEmailSignup);

    const verifySession = await verifySessionStorage.getSession();

    const headers = new Headers();

    headers.append(
      'set-cookie',
      await authSessionStorage.commitSession(authSession, {
        expires: new Date(finishEmailSignup.session.expiresAt),
      }),
    );

    headers.append(
      'set-cookie',
      await verifySessionStorage.destroySession(verifySession),
    );

    return redirect(Routes.Dashboard, { headers });
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
  return [{ title: 'Onboarding' }];
};

export function Onboarding({ actionData }: Route.ComponentProps) {
  const isFormPending = useIsFormPending();

  const [form, fields] = useForm({
    id: 'onboarding-form',
    constraint: getZodConstraint(OnboardingFormSchema),
    lastResult: actionData?.result,
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
          labelProps={{ htmlFor: fields.username.id, children: 'Username' }}
          inputProps={{
            ...getInputProps(fields.username, { type: 'text' }),
            autoComplete: 'username',
          }}
          errors={fields.username.errors ?? []}
        />
        <Field
          labelProps={{ htmlFor: fields.name.id, children: 'Name' }}
          inputProps={{
            ...getInputProps(fields.name, { type: 'text' }),
            autoComplete: 'name',
          }}
          errors={fields.name.errors ?? []}
        />
        <Field
          labelProps={{
            htmlFor: fields.password.id,
            children: 'Password',
          }}
          inputProps={{
            ...getInputProps(fields.password, { type: 'password' }),
            autoComplete: 'new-password',
          }}
          errors={fields.password.errors ?? []}
        />
        <Field
          labelProps={{
            htmlFor: fields.confirmPassword.id,
            children: 'Confirm Password',
          }}
          inputProps={{
            ...getInputProps(fields.confirmPassword, { type: 'password' }),
            autoComplete: 'new-password',
          }}
          errors={fields.confirmPassword.errors ?? []}
        />
        <CheckboxField
          labelProps={{
            htmlFor: fields.agreeToTerms.id,
            children: 'Agree to terms',
          }}
          checkboxProps={getInputProps(fields.agreeToTerms, {
            type: 'checkbox',
          })}
          errors={fields.agreeToTerms.errors ?? []}
        />
        <CheckboxField
          labelProps={{
            htmlFor: fields.rememberMe.id,
            children: 'Remember me',
          }}
          checkboxProps={getInputProps(fields.rememberMe, {
            type: 'checkbox',
          })}
          errors={fields.rememberMe.errors ?? []}
        />
        <FormErrorList errors={form.errors ?? []} id={form.errorId} />
        <StatusButton
          type="submit"
          status={submitButtonStatus}
          disabled={isFormPending}
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
