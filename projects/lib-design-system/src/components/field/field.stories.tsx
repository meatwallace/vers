import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { z } from 'zod';
import { Button } from '../button/button';
import { Field } from './field';

const SignupFormSchema = z.object({
  firstName: z.string().min(5),
});

export const Default = () => {
  const [form, fields] = useForm({
    constraint: getZodConstraint(SignupFormSchema),
    id: 'signup-form',
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: SignupFormSchema });
    },
    shouldRevalidate: 'onBlur',
  });

  return (
    <form {...getFormProps(form)}>
      <Field
        errors={fields.firstName.errors ?? []}
        inputProps={{
          ...getInputProps(fields.firstName, { type: 'text' }),
          placeholder: 'Enter your first name',
        }}
        labelProps={{
          children: 'First name',
        }}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
