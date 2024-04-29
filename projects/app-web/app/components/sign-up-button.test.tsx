import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignUpButton } from './sign-up-button';
import { createRemixStub } from '@remix-run/testing';
import { Routes } from '../types';

function ExpectedRoute() {
  return 'Auth0';
}

function setupTest() {
  const user = userEvent.setup();

  const SignUpButtonStub = createRemixStub([
    { path: Routes.Index, Component: SignUpButton },
    { path: Routes.AuthAuth0, Component: ExpectedRoute, action: () => null },
  ]);

  render(<SignUpButtonStub />);

  return { user };
}

test('it renders a sign up button that redirects to auth0 when pressed', async () => {
  const { user } = setupTest();

  const signUpButton = await screen.findByRole('button', { name: 'Sign up' });

  await waitFor(() => user.click(signUpButton));

  const auth0Page = await screen.findByText('Auth0');

  expect(auth0Page).toBeInTheDocument();
});
