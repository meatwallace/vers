import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { Index } from './_index';
import { Routes } from '../types';

function ExpectedRoute() {
  return 'Auth0';
}

function setupTest() {
  const user = userEvent.setup();

  const IndexStub = createRoutesStub([
    { path: '/', Component: Index },
    { path: Routes.AuthAuth0, Component: ExpectedRoute, action: () => null },
  ]);

  render(<IndexStub />);

  return { user };
}

test('it renders a sign up button that navigates to auth0 when clicked', async () => {
  const { user } = setupTest();

  const signUpButton = await screen.findByRole('button', { name: 'Sign up' });

  await waitFor(() => user.click(signUpButton));

  const loggedOutMessage = await screen.findByText('Auth0');

  expect(loggedOutMessage).toBeInTheDocument();
});

test('it renders a log in button that navigates to auth0 when clicked', async () => {
  const { user } = setupTest();

  const logInButton = await screen.findByRole('button', { name: 'Log in' });

  await waitFor(() => user.click(logInButton));

  const loggedOutMessage = await screen.findByText('Auth0');

  expect(loggedOutMessage).toBeInTheDocument();
});
