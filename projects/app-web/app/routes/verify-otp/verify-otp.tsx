import { data, Form, redirect, useSearchParams } from 'react-router';
import { z } from 'zod';
import { HoneypotInputs } from 'remix-utils/honeypot/react';
import { useForm, getFormProps, getInputProps } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { type Route } from './+types/verify-otp.ts';
import { graphql } from '~/gql';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { OTPField } from '~/components/field/index.ts';
import { FormErrorList } from '~/components/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { StatusButton } from '~/components/status-button.tsx';
import { useIsFormPending } from '~/hooks/use-is-form-pending.ts';
import { Routes } from '~/types.ts';
import { checkHoneypot } from '~/utils/check-honeypot.server.ts';
import { isMutationError } from '~/utils/is-mutation-error.ts';
import { handleVerification } from './handle-verification.server.ts';
import { VerificationType } from '~/gql/graphql.ts';

const verifyOTPMutation = graphql(/* GraphQL */ `
  mutation VerifyOTP($input: VerifyOTPInput!) {
    verifyOTP(input: $input) {
      ... on Verification {
        id
        target
      }

      ... on MutationErrorPayload {
        error {
          message
        }
      }
    }
  }
`);

export enum QueryParam {
  Code = 'code',
  Type = 'type',
  Target = 'target',
  RedirectTo = 'redirect',
}

const VerificationTypeSchema = z.nativeEnum(VerificationType);

export const VerifyOTPFormSchema = z.object({
  [QueryParam.Code]: z
    .string()
    .min(6, { message: 'Invalid code' })
    .max(6, { message: 'Invalid code' }),
  [QueryParam.Target]: z.string().min(1),
  [QueryParam.Type]: VerificationTypeSchema,
  [QueryParam.RedirectTo]: z.string().optional(),
});

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);

  const typeParsedWithZod = VerificationTypeSchema.safeParse(
    url.searchParams.get(QueryParam.Type),
  );

  if (!typeParsedWithZod.success) {
    // TODO(#16): capture invalid verify type
    return redirect(Routes.Signup);
  }

  return {};
}

export async function action({ request }: Route.ActionArgs) {
  const client = createGQLClient();

  const formData = await request.formData();

  await checkHoneypot(formData);

  const submission = parseWithZod(formData, { schema: VerifyOTPFormSchema });

  if (submission.status !== 'success') {
    const result = submission.reply();
    const status = submission.status === 'error' ? 400 : 200;

    return data({ result }, { status });
  }

  try {
    const { verifyOTP } = await client.request(verifyOTPMutation, {
      input: {
        code: submission.value.code,
        target: submission.value.target,
        type: submission.value.type,
      },
    });

    if (isMutationError(verifyOTP)) {
      const result = submission.reply({
        formErrors: [verifyOTP.error.message],
      });

      return data({ result }, { status: 400 });
    }

    return handleVerification(submission.value.type, {
      client,
      request,
      submission,
      body: formData,
    });
  } catch (error) {
    // TODO(#16): capture error
    console.error('error', error);
  }

  const result = submission.reply({
    formErrors: ['Something went wrong'],
  });

  return data({ result }, { status: 500 });
}

export function VerifyOTP({ actionData }: Route.ComponentProps) {
  const [searchParams] = useSearchParams();
  const isFormPending = useIsFormPending();

  const typeParsedWithZod = VerificationTypeSchema.safeParse(
    searchParams.get(QueryParam.Type),
  );

  const type = typeParsedWithZod.success ? typeParsedWithZod.data : null;

  const [form, fields] = useForm({
    id: 'verify-form',
    constraint: getZodConstraint(VerifyOTPFormSchema),
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifyOTPFormSchema });
    },
    defaultValue: {
      [QueryParam.Code]: searchParams.get(QueryParam.Code),
      [QueryParam.Target]: searchParams.get(QueryParam.Target),
      [QueryParam.Type]: type,
      [QueryParam.RedirectTo]: searchParams.get(QueryParam.RedirectTo),
    },
  });

  const submitButtonStatus = isFormPending
    ? StatusButton.Status.Pending
    : StatusButton.Status.Idle;

  return (
    <main>
      <Form method="POST" {...getFormProps(form)}>
        <HoneypotInputs />
        <OTPField
          labelProps={{
            htmlFor: fields[QueryParam.Code].id,
            children: 'Code',
          }}
          inputProps={{
            ...getInputProps(fields[QueryParam.Code], { type: 'text' }),
            autoComplete: 'one-time-code',
            autoFocus: true,
          }}
          errors={fields[QueryParam.Code].errors ?? []}
        />
        <input
          {...getInputProps(fields[QueryParam.Type], { type: 'hidden' })}
        />
        <input
          {...getInputProps(fields[QueryParam.Target], { type: 'hidden' })}
        />
        <input
          {...getInputProps(fields[QueryParam.RedirectTo], { type: 'hidden' })}
        />
        <StatusButton
          type="submit"
          status={submitButtonStatus}
          disabled={isFormPending}
        >
          Verify
        </StatusButton>
        <FormErrorList errors={form.errors ?? []} id={form.errorId} />
      </Form>
    </main>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default VerifyOTP;
