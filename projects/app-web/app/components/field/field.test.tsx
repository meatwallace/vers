import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field } from './field';

test('it renders a label and an input', () => {
  render(
    <Field
      errors={[]}
      inputProps={{ type: 'email' }}
      labelProps={{ children: 'Email' }}
    />,
  );

  const input = screen.getByLabelText('Email');

  expect(input).toBeInTheDocument();
  expect(input).toHaveAttribute('type', 'email');
});

test('it handles input changes', async () => {
  const handleChange = vi.fn();
  const user = userEvent.setup();

  render(
    <Field
      errors={[]}
      inputProps={{ onChange: handleChange, type: 'email' }}
      labelProps={{ children: 'Email' }}
    />,
  );

  await user.type(screen.getByLabelText('Email'), 'test@example.com');

  expect(handleChange).toHaveBeenCalled();
});

test('it displays error messages', () => {
  render(
    <Field
      errors={['Invalid email address']}
      inputProps={{ type: 'email' }}
      labelProps={{ children: 'Email' }}
    />,
  );

  expect(screen.getByText('Invalid email address')).toBeInTheDocument();
  expect(screen.getByLabelText('Email')).toHaveAttribute(
    'aria-invalid',
    'true',
  );
});
