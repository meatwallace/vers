import { expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckboxField } from './checkbox-field';

test('it renders a label and a checkbox input', () => {
  render(
    <CheckboxField
      checkboxProps={{ type: 'checkbox' }}
      errors={[]}
      labelProps={{ children: 'Remember me' }}
    />,
  );

  const checkbox = screen.getByLabelText('Remember me');

  expect(checkbox).toBeInTheDocument();
  expect(checkbox).toHaveAttribute('type', 'checkbox');
});

test('it handles checkbox state changes', async () => {
  const handleChange = vi.fn();
  const user = userEvent.setup();

  render(
    <CheckboxField
      checkboxProps={{ onChange: handleChange, type: 'checkbox' }}
      errors={[]}
      labelProps={{ children: 'Remember me' }}
    />,
  );

  await user.click(screen.getByLabelText('Remember me'));

  expect(handleChange).toHaveBeenCalledWith(
    expect.objectContaining({
      target: expect.objectContaining({
        checked: true,
      }),
    }),
  );
});

test('it displays error messages', () => {
  render(
    <CheckboxField
      checkboxProps={{ type: 'checkbox' }}
      errors={['This field is required']}
      labelProps={{ children: 'Remember me' }}
    />,
  );

  expect(screen.getByText('This field is required')).toBeInTheDocument();
  expect(screen.getByLabelText('Remember me')).toHaveAttribute(
    'aria-invalid',
    'true',
  );
});
