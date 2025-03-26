import { data, Form, redirect } from 'react-router';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { Field, Heading, StatusButton, Text } from '@vers/design-system';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { ContentContainer } from '~/components/content-container';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { StartChangeUserEmailMutation } from '~/data/mutations/start-change-user-email.ts';
import { StartStepUpAuthMutation } from '~/data/mutations/start-step-up-auth.ts';
import { GetCurrentUserQuery } from '~/data/queries/get-current-user';
import { StepUpAction, VerificationType } from '~/gql/graphql.ts';
import { useIsFormPending } from '~/hooks/use-is-form-pending.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { Routes } from '~/types.ts';
import { handleGQLError } from '~/utils/handle-gql-error.ts';
import { isMutationError } from '~/utils/is-mutation-error.ts';
import { requireAuth } from '~/utils/require-auth.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import { UserEmailSchema } from '~/validation/user-email-schema.ts';
import type { Route } from './+types/route.ts';
import { QueryParam } from '../verify-otp/types.ts';
import * as styles from './route.styles.ts';

export const meta: Route.MetaFunction = () => [
  {
    description: 'Change your account email address',
    title: 'vers | Change Email',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  await requireAuth(args.request);

  const verifySession = await verifySessionStorage.getSession(
    args.request.headers.get('cookie'),
  );

  const transactionToken = verifySession.get('changeEmail#transactionToken');

  // if we have a transaction token, presumably we've already 2FA'd so we're good to go
  if (transactionToken) {
    return {};
  }

  const userResult = await args.context.client.query(GetCurrentUserQuery, {});

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
  const result = await args.context.client.mutation(StartStepUpAuthMutation, {
    input: {
      action: StepUpAction.ChangeEmail,
    },
  });

  if (result.error) {
    handleGQLError(result.error);

    throw result.error;
  }

  if (isMutationError(result.data?.startStepUpAuth)) {
    throw new Error(result.data.startStepUpAuth.error.message);
  }

  invariant(result.data, 'if no error, there must be data');

  verifySession.set(
    'changeEmail#transactionID',
    result.data.startStepUpAuth.transactionID,
  );

  const setCookieHeader =
    await verifySessionStorage.commitSession(verifySession);

  const verifySearchParams = new URLSearchParams({
    [QueryParam.Target]: user.email,
    [QueryParam.Type]: VerificationType.ChangeEmail,
  });

  return redirect(`${Routes.VerifyOTP}?${verifySearchParams.toString()}`, {
    headers: { 'set-cookie': setCookieHeader },
  });
});

const ChangeUserEmailFormSchema = z.object({
  email: UserEmailSchema,
});

export const action = withErrorHandling(async (args: Route.ActionArgs) => {
  await requireAuth(args.request);

  const formData = await args.request.formData();

  const submission = parseWithZod(formData, {
    schema: ChangeUserEmailFormSchema,
  });

  if (submission.status !== 'success') {
    const result = submission.reply();
    const status = submission.status === 'error' ? 400 : 200;

    return data({ result }, { status });
  }

  const verifySession = await verifySessionStorage.getSession(
    args.request.headers.get('Cookie'),
  );

  const transactionToken = verifySession.get('changeEmail#transactionToken');

  const result = await args.context.client.mutation(
    StartChangeUserEmailMutation,
    {
      input: {
        email: submission.value.email,
        transactionToken: transactionToken,
      },
    },
  );

  if (result.error) {
    handleGQLError(result.error);

    const formResult = submission.reply({
      formErrors: ['Something went wrong'],
    });

    return data({ result: formResult }, { status: 400 });
  }

  if (isMutationError(result.data?.startChangeUserEmail)) {
    const formResult = submission.reply({
      formErrors: [result.data.startChangeUserEmail.error.message],
    });

    return data({ result: formResult }, { status: 400 });
  }

  invariant(result.data, 'if no error, there must be data');

  verifySession.unset('changeEmail#transactionID');
  verifySession.set(
    'changeEmailConfirm#transactionID',
    result.data.startChangeUserEmail.transactionID,
  );

  const setCookieHeader =
    await verifySessionStorage.commitSession(verifySession);

  const verifySearchParams = new URLSearchParams({
    [QueryParam.Target]: submission.value.email,
    [QueryParam.Type]: VerificationType.ChangeEmailConfirmation,
  });

  return redirect(`${Routes.VerifyOTP}?${verifySearchParams.toString()}`, {
    headers: { 'set-cookie': setCookieHeader },
  });
});

export function AccountChangeUserEmail(props: Route.ComponentProps) {
  const isFormPending = useIsFormPending();

  const [form, fields] = useForm({
    constraint: getZodConstraint(ChangeUserEmailFormSchema),
    id: 'change-email-form',
    lastResult: props.actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ChangeUserEmailFormSchema });
    },
    shouldRevalidate: 'onBlur',
  });

  const submitButtonStatus = isFormPending
    ? StatusButton.Status.Pending
    : StatusButton.Status.Idle;

  return (
    <ContentContainer>
      <div className={styles.container}>
        <Heading level={2}>Change your email address</Heading>
        <Text align="center">
          Enter your new email address below. A verification link will be sent
          to the new email address to confirm the change.
        </Text>
        <Form
          method="POST"
          {...getFormProps(form)}
          className={styles.formStyles}
        >
          <Field
            errors={fields.email.errors ?? []}
            inputProps={{
              ...getInputProps(fields.email, { type: 'email' }),
              autoComplete: 'email',
              placeholder: 'your.new.email@example.com',
            }}
            labelProps={{ children: 'New Email Address' }}
          />
          <FormErrorList errors={form.errors ?? []} id={form.errorId} />
          <StatusButton
            disabled={isFormPending}
            status={submitButtonStatus}
            type="submit"
            variant="primary"
            fullWidth
          >
            Change Email
          </StatusButton>
        </Form>
      </div>
    </ContentContainer>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default AccountChangeUserEmail;
