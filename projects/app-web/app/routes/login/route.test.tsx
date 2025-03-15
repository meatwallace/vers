import { afterEach, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { drop } from '@mswjs/data';
import { GraphQLError } from 'graphql';
import { graphql } from 'msw';
import { db } from '~/mocks/db.ts';
import { server } from '~/mocks/node.ts';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { Routes } from '~/types.ts';
import { action, loader, Login } from './route.tsx';

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
      action: config.isAuthed
        ? withAuthedUser(action, { user: config.user })
        : action,
      Component: withRouteProps(Login),
      loader: config.isAuthed
        ? withAuthedUser(loader, { user: config.user })
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
  server.resetHandlers();

  drop(db);
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

  const error = await screen.findByText('Email is invalid');

  expect(error).toBeInTheDocument();
});

test('it shows validation errors for a short password', async () => {
  const { user } = setupTest({ isAuthed: false });

  const passwordInput = await screen.findByLabelText('Password');
  const submitButton = screen.getByRole('button', { name: 'Sign in' });

  await user.type(passwordInput, 'short');
  await user.click(submitButton);

  const error = await screen.findByText('Password is too short');

  expect(error).toBeInTheDocument();
});

test('it navigates to signup page when clicking the signup link', async () => {
  const { user } = setupTest({ isAuthed: false });

  const signupLink = await screen.findByRole('link', { name: 'Signup' });

  await user.click(signupLink);

  const signupRoute = await screen.findByText('SIGN_UP_ROUTE');

  expect(signupRoute).toBeInTheDocument();
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

  const dashboardRoute = await screen.findByText('DASHBOARD_ROUTE');

  expect(dashboardRoute).toBeInTheDocument();
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

  const redirectRoute = await screen.findByText('CUSTOM_REDIRECT_ROUTE');

  expect(redirectRoute).toBeInTheDocument();
});

test('it shows error message for invalid credentials', async () => {
  const { user } = setupTest({ isAuthed: false });

  const emailInput = await screen.findByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const submitButton = screen.getByRole('button', { name: 'Sign in' });

  await user.type(emailInput, 'nonexistent@example.com');
  await user.type(passwordInput, 'password123');
  await user.click(submitButton);

  const error = await screen.findByText('Wrong email or password');

  expect(error).toBeInTheDocument();
});

test('it shows a generic error if the mutation fails', async () => {
  server.use(
    graphql.mutation('LoginWithPassword', () => {
      throw new GraphQLError('Something went wrong');
    }),
  );

  const { user } = setupTest({ isAuthed: false });

  const emailInput = await screen.findByLabelText('Email');
  const passwordInput = screen.getByLabelText('Password');
  const submitButton = screen.getByRole('button', { name: 'Sign in' });

  await user.type(emailInput, 'test@example.com');
  await user.type(passwordInput, 'password123');
  await user.click(submitButton);

  const error = await screen.findByText('Something went wrong');

  expect(error).toBeInTheDocument();
});

test('it redirects to the dashboard route when already authenticated', async () => {
  setupTest({ isAuthed: true });

  const dashboardRoute = await screen.findByText('DASHBOARD_ROUTE');

  expect(dashboardRoute).toBeInTheDocument();
});
