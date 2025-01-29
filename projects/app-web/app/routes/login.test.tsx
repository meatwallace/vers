import userEvent from '@testing-library/user-event';
import { afterEach, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import { drop } from '@mswjs/data';
import { db } from '~/mocks/db.ts';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { Routes } from '~/types.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { Login, action, loader } from './login.tsx';

const client = createGQLClient();

type TestConfig = {
  isAuthed: boolean;
  user?: {
    email?: string;
    password?: string;
  };
};

function setupTest(config: TestConfig) {
  const user = userEvent.setup();

  const LoginStub = createRoutesStub([
    {
      path: '/',
      Component: withRouteProps(Login),
      // @ts-expect-error(#35) - react router test types are out of date
      action: config.isAuthed
        ? // @ts-expect-error(#35) - react router test types are out of date
          withAuthedUser(action, { client, user: config.user })
        : action,
      // @ts-expect-error(#35) - react router test types are out of date
      loader: config.isAuthed
        ? // @ts-expect-error(#35) - react router test types are out of date
          withAuthedUser(loader, { client, user: config.user })
        : loader,
    },
    {
      path: Routes.Dashboard,
      Component: () => 'DASHBOARD_ROUTE',
    },
    {
      path: Routes.Signup,
      Component: () => 'SIGN_UP_ROUTE',
    },
  ]);

  render(<LoginStub />);

  return { user };
}

afterEach(() => {
  drop(db);

  client.setHeader('authorization', '');
});

test('it renders the login form', async () => {
  setupTest({ isAuthed: false });

  const emailInput = await screen.findByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const submitButton = screen.getByRole('button', { name: 'Sign in' });
  const rememberMeCheckbox = screen.getByRole('checkbox', {
    name: 'Remember me',
  });

  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(rememberMeCheckbox).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test('it shows validation errors for an invalid email', async () => {
  const { user } = setupTest({ isAuthed: false });

  const emailInput = await screen.findByLabelText('Email');
  const submitButton = screen.getByRole('button', { name: 'Sign in' });

  await user.type(emailInput, 'invalid-email');
  await user.click(submitButton);

  expect(await screen.findByText('Email is invalid')).toBeInTheDocument();
});

test('it shows validation errors for a short password', async () => {
  const { user } = setupTest({ isAuthed: false });

  const passwordInput = await screen.findByLabelText('Password');
  const submitButton = screen.getByRole('button', { name: 'Sign in' });

  await user.type(passwordInput, 'short');
  await user.click(submitButton);

  expect(await screen.findByText('Password is too short')).toBeInTheDocument();
});

test('it navigates to signup page when clicking the signup link', async () => {
  const { user } = setupTest({ isAuthed: false });

  const signupLink = await screen.findByRole('link', { name: 'Signup' });

  await user.click(signupLink);

  expect(await screen.findByText('SIGN_UP_ROUTE')).toBeInTheDocument();
});

test('it redirects to dashboard on successful login', async () => {
  db.user.create({
    email: 'test@example.com',
    password: 'password123',
  });

  const { user } = setupTest({ isAuthed: false });

  const emailInput = await screen.findByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const submitButton = screen.getByRole('button', { name: 'Sign in' });

  await user.type(emailInput, 'test@example.com');
  await user.type(passwordInput, 'password123');
  await user.click(submitButton);

  expect(await screen.findByText('DASHBOARD_ROUTE')).toBeInTheDocument();
});

test('it shows error message for invalid credentials', async () => {
  const { user } = setupTest({ isAuthed: false });

  const emailInput = await screen.findByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const submitButton = screen.getByRole('button', { name: 'Sign in' });

  await user.type(emailInput, 'nonexistent@example.com');
  await user.type(passwordInput, 'password123');
  await user.click(submitButton);

  expect(
    await screen.findByText('No user with that email'),
  ).toBeInTheDocument();
});

test('it redirects to the dashboard route when already authenticated', async () => {
  setupTest({ isAuthed: true });

  expect(await screen.findByText('DASHBOARD_ROUTE')).toBeInTheDocument();
});
