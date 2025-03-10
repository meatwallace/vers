import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OTPField } from './otp-field';

test('it renders a label and an OTP input', () => {
  render(
    <OTPField
      errors={[]}
      inputProps={{ onChange: vi.fn(), value: '' }}
      labelProps={{ children: 'Enter code' }}
    />,
  );

  expect(screen.getByLabelText('Enter code')).toBeInTheDocument();
  expect(screen.getAllByRole('textbox')).toHaveLength(1);
});

test('it handles input changes', async () => {
  const handleChange = vi.fn();
  const user = userEvent.setup();

  render(
    <OTPField
      errors={[]}
      inputProps={{ onChange: handleChange, value: '' }}
      labelProps={{ children: 'Enter code' }}
    />,
  );

  await user.type(screen.getByLabelText('Enter code'), '123456');

  expect(handleChange).toHaveBeenCalled();
});

test('it displays error messages', () => {
  render(
    <OTPField
      errors={['Invalid code']}
      inputProps={{ onChange: vi.fn(), value: '' }}
      labelProps={{ children: 'Enter code' }}
    />,
  );

  expect(screen.getByText('Invalid code')).toBeInTheDocument();
  expect(screen.getByLabelText('Enter code')).toHaveAttribute(
    'aria-invalid',
    'true',
  );
});
