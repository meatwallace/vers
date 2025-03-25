import { getFormProps, getInputProps, useForm } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { z } from 'zod';
import { Button } from '../components/button/button';
import { CheckboxField } from '../components/checkbox-field/checkbox-field';
import { Field } from '../components/field/field';

const SignupFormSchema = z.object({
  agreeToTerms: z
    .literal('on', {
      errorMap: () => ({
        message: 'You must agree to the terms of service and privacy policy',
      }),
    })
    .transform(Boolean),
  confirmPassword: z.string().min(6),
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
  rememberMe: z.boolean().optional(),
  username: z.string().min(4),
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
        errors={fields.name.errors ?? []}
        inputProps={{
          ...getInputProps(fields.name, { type: 'text' }),
          placeholder: 'John Smith',
        }}
        labelProps={{
          children: 'Name',
        }}
      />
      <Field
        errors={fields.email.errors ?? []}
        inputProps={{
          ...getInputProps(fields.email, { type: 'email' }),
          placeholder: 'your.email@example.com',
        }}
        labelProps={{
          children: 'Email',
        }}
      />
      <Field
        errors={fields.username.errors ?? []}
        inputProps={{
          ...getInputProps(fields.username, { type: 'text' }),
          placeholder: 'johnsmith_123',
        }}
        labelProps={{
          children: 'Username',
        }}
      />
      <Field
        errors={fields.password.errors ?? []}
        inputProps={{
          ...getInputProps(fields.password, { type: 'password' }),
          placeholder: 'Enter your password',
        }}
        labelProps={{
          children: 'Password',
        }}
      />
      <Field
        errors={fields.confirmPassword.errors ?? []}
        inputProps={{
          ...getInputProps(fields.confirmPassword, { type: 'password' }),
          placeholder: 'Confirm your password',
        }}
        labelProps={{
          children: 'Confirm password',
        }}
      />
      <CheckboxField
        checkboxProps={{
          ...getInputProps(fields.rememberMe, { type: 'checkbox' }),
        }}
        errors={fields.rememberMe.errors ?? []}
        labelProps={{ children: 'Remember me' }}
      />
      <CheckboxField
        checkboxProps={{
          ...getInputProps(fields.agreeToTerms, { type: 'checkbox' }),
        }}
        errors={fields.agreeToTerms.errors ?? []}
        labelProps={{ children: 'Agree to terms and services' }}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
