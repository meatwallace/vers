import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OTPField } from './otp-field';

test('it renders an OTP input', () => {
  render(
    <OTPField errors={[]} inputProps={{ onChange: vi.fn(), value: '' }} />,
  );

  const input = screen.getByTestId('otp-input');

  expect(input).toBeInTheDocument();
});

test('it handles input changes', async () => {
  const handleChange = vi.fn();
  const user = userEvent.setup();

  render(<OTPField errors={[]} inputProps={{ onChange: handleChange }} />);

  const input = screen.getByTestId('otp-input');

  await user.type(input, '123456');

  expect(handleChange).toHaveBeenCalledTimes(6);
});

test('it displays error messages', () => {
  render(
    <OTPField
      errors={['Invalid code']}
      inputProps={{ onChange: vi.fn(), value: '' }}
    />,
  );

  const input = screen.getByTestId('otp-input');
  const error = screen.getByText('Invalid code');

  expect(error).toBeInTheDocument();
  expect(input).toHaveAttribute('aria-invalid', 'true');
});
