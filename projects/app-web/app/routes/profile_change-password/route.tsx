import { data, Form, redirect } from 'react-router';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { Field } from '~/components/field';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { StatusButton } from '~/components/status-button.tsx';
import { ChangeUserPasswordMutation } from '~/data/mutations/change-user-password.ts';
import { StartChangeUserPasswordMutation } from '~/data/mutations/start-change-user-password.ts';
import { GetCurrentUserQuery } from '~/data/queries/get-current-user';
import { VerificationType } from '~/gql/graphql.ts';
import { useIsFormPending } from '~/hooks/use-is-form-pending.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { handleGQLError } from '~/utils/handle-gql-error.ts';
import { isMutationError } from '~/utils/is-mutation-error.ts';
import { requireAuth } from '~/utils/require-auth.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import { ConfirmPasswordSchema } from '~/validation/confirm-password-schema.ts';
import type { Route } from './+types/route.ts';
import { QueryParam } from '../verify-otp/types.ts';

export const meta: Route.MetaFunction = () => [
  {
    description: 'Change your account password',
    title: 'Vers | Change Password',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  const { request } = args;

  await requireAuth(request);

  const client = await createGQLClient(request);

  const verifySession = await verifySessionStorage.getSession(
    request.headers.get('cookie'),
  );

  const transactionToken = verifySession.get(
    'changeUserPassword#transactionToken',
  );

  // if we have a transaction token, presumably we've already 2FA'd so we're good to go
  if (transactionToken) {
    return {};
  }

  const userResult = await client.query(GetCurrentUserQuery, {});

  if (userResult.error) {
    handleGQLError(userResult.error);

    throw userResult.error;
  }

  invariant(userResult.data, 'if no error, there must be data');

  const { getCurrentUser: user } = userResult.data;

  // if the user doesn't have 2FA enabled, return early
  if (!user.is2FAEnabled) {
    return {};
  }

  // if our user has 2FA enabled, we need to start the step up auth process
  // and store a pending transaction ID in the session
  const result = await client.mutation(StartChangeUserPasswordMutation, {
    input: {},
  });

  if (result.error) {
    handleGQLError(result.error);

    throw result.error;
  }

  if (isMutationError(result.data?.startChangeUserPassword)) {
    throw new Error(result.data.startChangeUserPassword.error.message);
  }

  invariant(result.data, 'if no error, there must be data');

  verifySession.set(
    'changeUserPassword#transactionID',
    result.data.startChangeUserPassword.transactionID,
  );

  const setCookieHeader =
    await verifySessionStorage.commitSession(verifySession);

  const verifySearchParams = new URLSearchParams({
    [QueryParam.Target]: user.email,
    [QueryParam.Type]: VerificationType.ChangePassword,
  });

  return redirect(`${Routes.VerifyOTP}?${verifySearchParams.toString()}`, {
    headers: { 'set-cookie': setCookieHeader },
  });
});

const ChangeUserPasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
  })
  .and(ConfirmPasswordSchema);

// as our mutation doesn't explicitly require a transaction token to be passed,
// our logic can be the same here for both 2FA and non-2FA password change flows.
// our loader should prevent us from ever seeing running this action unless we're
// ready to execute.
export const action = withErrorHandling(async (args: Route.ActionArgs) => {
  const { request } = args;

  await requireAuth(request);

  const client = await createGQLClient(request);
  const formData = await request.formData();

  const submission = parseWithZod(formData, {
    schema: ChangeUserPasswordFormSchema,
  });

  if (submission.status !== 'success') {
    const result = submission.reply();
    const status = submission.status === 'error' ? 400 : 200;

    return data({ result }, { status });
  }

  const verifySession = await verifySessionStorage.getSession(
    request.headers.get('Cookie'),
  );

  const transactionToken = verifySession.get(
    'changeUserPassword#transactionToken',
  );

  const result = await client.mutation(ChangeUserPasswordMutation, {
    input: {
      currentPassword: submission.value.currentPassword,
      newPassword: submission.value.password,
      transactionToken,
    },
  });

  if (result.error) {
    handleGQLError(result.error);

    const formResult = submission.reply({
      formErrors: ['Something went wrong'],
    });

    return data({ result: formResult }, { status: 400 });
  }

  if (isMutationError(result.data?.changeUserPassword)) {
    const formResult = submission.reply({
      formErrors: [result.data.changeUserPassword.error.message],
    });

    return data({ result: formResult }, { status: 400 });
  }

  // clear any session data that might be set that we no longer need
  verifySession.unset('changeUserPassword#transactionToken');
  verifySession.unset('changeUserPassword#transactionID');

  const setCookieHeader =
    await verifySessionStorage.commitSession(verifySession);

  return redirect(Routes.Profile, {
    headers: { 'set-cookie': setCookieHeader },
  });
});

export function ProfileChangeUserPassword(props: Route.ComponentProps) {
  const isFormPending = useIsFormPending();

  const [form, fields] = useForm({
    constraint: getZodConstraint(ChangeUserPasswordFormSchema),
    id: 'change-password-form',
    lastResult: props.actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ChangeUserPasswordFormSchema });
    },
    shouldRevalidate: 'onBlur',
  });

  const submitButtonStatus = isFormPending
    ? StatusButton.Status.Pending
    : StatusButton.Status.Idle;

  return (
    <main>
      <section>
        <h1>Change Password</h1>
        <Form method="POST" {...getFormProps(form)}>
          <Field
            errors={fields.currentPassword.errors ?? []}
            inputProps={{
              ...getInputProps(fields.currentPassword, { type: 'password' }),
              autoComplete: 'current-password',
            }}
            labelProps={{
              children: 'Current Password',
              htmlFor: fields.currentPassword.id,
            }}
          />

          <Field
            errors={fields.password.errors ?? []}
            inputProps={{
              ...getInputProps(fields.password, { type: 'password' }),
              autoComplete: 'new-password',
            }}
            labelProps={{
              children: 'New Password',
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
              children: 'Confirm New Password',
              htmlFor: fields.confirmPassword.id,
            }}
          />

          <FormErrorList errors={form.errors ?? []} id={form.errorId} />

          <StatusButton
            disabled={isFormPending}
            status={submitButtonStatus}
            type="submit"
          >
            Change Password
          </StatusButton>
        </Form>
      </section>
    </main>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default ProfileChangeUserPassword;
