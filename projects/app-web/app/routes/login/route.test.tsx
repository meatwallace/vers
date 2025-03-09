import { afterEach, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { drop } from '@mswjs/data';
import { db } from '~/mocks/db.ts';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { Routes } from '~/types.ts';
import { createGQLClient } from '~/utils/create-gql-client.server.ts';
import { action, loader, Login } from './route.tsx';

const client = createGQLClient();

interface TestConfig {
  initialPath?: string;
  isAuthed: boolean;
  user?: {
    email?: string;
    password?: string;
  };
}

function setupTest(config: TestConfig) {
  const initialPath = config.initialPath ?? '/';
  const user = userEvent.setup();

  const LoginStub = createRoutesStub([
    {
      // @ts-expect-error(#35) - react router test types are out of date
      action: config.isAuthed
        ? // @ts-expect-error(#35) - react router test types are out of date
          withAuthedUser(action, { client, user: config.user })
        : action,
      Component: withRouteProps(Login),
      // @ts-expect-error(#35) - react router test types are out of date
      loader: config.isAuthed
        ? // @ts-expect-error(#35) - react router test types are out of date
          withAuthedUser(loader, { client, user: config.user })
        : loader,
      path: '/',
    },
    {
      Component: () => 'DASHBOARD_ROUTE',
      path: Routes.Dashboard,
    },
    {
      Component: () => 'SIGN_UP_ROUTE',
      path: Routes.Signup,
    },
    {
      Component: () => 'CUSTOM_REDIRECT_ROUTE',
      path: '/custom-redirect-route',
    },
  ]);

  render(<LoginStub initialEntries={[initialPath]} />);

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

test('it redirects to the specified route when provided', async () => {
  db.user.create({
    email: 'test@example.com',
    password: 'password123',
  });

  const { user } = setupTest({
    initialPath: '/?redirect=/custom-redirect-route',
    isAuthed: false,
  });

  const emailInput = await screen.findByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const submitButton = screen.getByRole('button', { name: 'Sign in' });

  await user.type(emailInput, 'test@example.com');
  await user.type(passwordInput, 'password123');
  await user.click(submitButton);

  expect(await screen.findByText('CUSTOM_REDIRECT_ROUTE')).toBeInTheDocument();
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
