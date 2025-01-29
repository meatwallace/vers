import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { CheckboxField } from './checkbox-field';

test('it renders a label and a checkbox input', () => {
  render(
    <CheckboxField
      labelProps={{ children: 'Remember me' }}
      checkboxProps={{ type: 'checkbox' }}
      errors={[]}
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
      labelProps={{ children: 'Remember me' }}
      checkboxProps={{ type: 'checkbox', onChange: handleChange }}
      errors={[]}
    />,
  );

  await user.click(screen.getByLabelText('Remember me'));

  expect(handleChange).toHaveBeenCalled();
});

test('it displays error messages', () => {
  render(
    <CheckboxField
      labelProps={{ children: 'Remember me' }}
      checkboxProps={{ type: 'checkbox' }}
      errors={['This field is required']}
    />,
  );

  expect(screen.getByText('This field is required')).toBeInTheDocument();
  expect(screen.getByLabelText('Remember me')).toHaveAttribute(
    'aria-invalid',
    'true',
  );
});
