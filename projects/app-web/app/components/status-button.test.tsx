import { render, screen } from '@testing-library/react';
import { StatusButton } from './status-button';

test('it renders children content', () => {
  render(
    <StatusButton status={StatusButton.Status.Idle}>Click me</StatusButton>,
  );

  expect(screen.getByText('Click me')).toBeInTheDocument();
});

test('it can be disabled', () => {
  render(
    <StatusButton status={StatusButton.Status.Idle} disabled>
      Click me
    </StatusButton>,
  );

  expect(screen.getByText('Click me')).toBeDisabled();
});

test('it shows loading state when pending', () => {
  render(
    <StatusButton status={StatusButton.Status.Pending}>Click me</StatusButton>,
  );

  expect(screen.getByRole('status')).toBeInTheDocument();
});

test('it shows success state', () => {
  render(
    <StatusButton status={StatusButton.Status.Success}>Click me</StatusButton>,
  );

  expect(screen.getByRole('img', { name: /success/i })).toBeInTheDocument();
});

test('it shows error state', () => {
  render(
    <StatusButton status={StatusButton.Status.Error}>Click me</StatusButton>,
  );

  expect(screen.getByRole('img', { name: /error/i })).toBeInTheDocument();
});
