import { data, Form, redirect } from 'react-router';
import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { Class, ClassID } from '@vers/data';
import { Field, Heading, StatusButton } from '@vers/design-system';
import { AvatarNameSchema } from '@vers/validation';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { FormErrorList } from '~/components/form-error-list/form-error-list.tsx';
import { RouteErrorBoundary } from '~/components/route-error-boundary.tsx';
import { CreateAvatarMutation } from '~/data/mutations/create-avatar.ts';
import { resolveGQLEnumFromClass } from '~/data/utils/resolve-gql-enum-from-class';
import { useIsFormPending } from '~/hooks/use-is-form-pending.ts';
import { Routes } from '~/types';
import { handleGQLError } from '~/utils/handle-gql-error.ts';
import { isMutationError } from '~/utils/is-mutation-error.ts';
import { requireAuth } from '~/utils/require-auth.server.ts';
import { withErrorHandling } from '~/utils/with-error-handling.ts';
import type { Route } from './+types/route.ts';
import { ClassSelectionInput } from './class-selection-input.tsx';
import * as styles from './route.styles.ts';

export const meta: Route.MetaFunction = () => [
  {
    description: '',
    title: 'vers | Create an Avatar',
  },
];

export const loader = withErrorHandling(async (args: Route.LoaderArgs) => {
  await requireAuth(args.request);

  return {};
});

export const action = withErrorHandling(async (args: Route.ActionArgs) => {
  const formData = await args.request.formData();

  const submission = parseWithZod(formData, {
    schema: AvatarCreateFormSchema,
  });

  if (submission.status !== 'success') {
    const result = submission.reply();
    const status = submission.status === 'error' ? 400 : 200;

    return data({ result }, { status });
  }

  const result = await args.context.client.mutation(CreateAvatarMutation, {
    input: {
      class: resolveGQLEnumFromClass(submission.value.class),
      name: submission.value.name,
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

  if (isMutationError(result.data.createAvatar)) {
    const formResult = submission.reply({
      formErrors: [result.data.createAvatar.error.message],
    });

    return data({ result: formResult }, { status: 400 });
  }

  return redirect(Routes.Avatar);
});

const AvatarCreateFormSchema = z.object({
  class: z.nativeEnum(Class),
  name: AvatarNameSchema,
});

export function AvatarCreate(props: Route.ComponentProps) {
  const isFormPending = useIsFormPending();

  const [form, fields] = useForm({
    constraint: getZodConstraint(AvatarCreateFormSchema),
    defaultValue: {},
    id: 'avatar-create-form',
    lastResult: props.actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: AvatarCreateFormSchema });
    },
    shouldRevalidate: 'onBlur',
  });

  const submitButtonStatus = isFormPending
    ? StatusButton.Status.Pending
    : StatusButton.Status.Idle;

  const handleSelectClass = (classID: ClassID) => {
    form.update({ index: undefined, name: 'class', value: classID });
  };

  return (
    <div className={styles.container}>
      <Heading level={1}>Create an Avatar</Heading>
      <Form method="POST" {...getFormProps(form)} className={styles.formStyles}>
        <ClassSelectionInput
          {...omitKeyProp(getInputProps(fields.class, { type: 'hidden' }))}
          selected={fields.class.value as ClassID | undefined}
          onSelectClass={handleSelectClass}
        />
        <Field
          className={styles.nameField}
          errors={fields.name.errors ?? []}
          inputProps={{
            ...getInputProps(fields.name, { type: 'text' }),
            autoComplete: 'name',
            onKeyDown: handleNameInputKeyDown,
            placeholder: 'Enter your name',
          }}
          labelProps={{ children: 'Name' }}
        />
        <StatusButton
          status={submitButtonStatus}
          type="submit"
          variant="primary"
        >
          Create Avatar
        </StatusButton>
        <FormErrorList errors={form.errors} />
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  return <RouteErrorBoundary />;
}

export default AvatarCreate;

/**
 * forces the user to only input letters and backspace in our name field
 */
function handleNameInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
  const isBackspace = event.key === 'Backspace';
  const isLetter = /^[a-zA-Z]+$/.test(event.key);

  if (!isBackspace && !isLetter) {
    event.preventDefault();
  }
}

/**
 * required to bypasss an annoying error thrown by conform-to's getFieldProps
 *
 * ref: https://github.com/edmundhung/conform/issues/620
 */
function omitKeyProp(obj: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => key !== 'key'),
  );
}
