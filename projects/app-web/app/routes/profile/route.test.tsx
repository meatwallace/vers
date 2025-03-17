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
import { action, loader, Profile } from './route.tsx';

interface TestConfig {
  isAuthed: boolean;
  user?: {
    email?: string;
    id?: string;
    is2FAEnabled?: boolean;
    name?: string;
  };
}

function setupTest(config: TestConfig) {
  const user = userEvent.setup();

  const ProfileStub = createRoutesStub([
    {
      action: config.isAuthed
        ? withAuthedUser(action, { user: config.user })
        : action,
      Component: withRouteProps(Profile),
      loader: config.isAuthed
        ? withAuthedUser(loader, { user: config.user })
        : loader,
      path: '/',
    },
    {
      Component: () => 'LOGIN_ROUTE',
      path: Routes.Login,
    },
    {
      Component: () => 'CHANGE_EMAIL_ROUTE',
      path: Routes.ProfileChangeEmail,
    },
    {
      Component: () => 'CHANGE_PASSWORD_ROUTE',
      path: Routes.ProfileChangePassword,
    },
  ]);

  render(<ProfileStub />);

  return { user };
}

afterEach(() => {
  server.resetHandlers();

  drop(db);
});

test('it redirects to the login route when not authenticated', async () => {
  setupTest({ isAuthed: false });

  const loginRoute = await screen.findByText('LOGIN_ROUTE');

  expect(loginRoute).toBeInTheDocument();
});

test('it renders the profile page with user information when authenticated', async () => {
  setupTest({
    isAuthed: true,
    user: {
      email: 'test@example.com',
      id: 'user_id',
      is2FAEnabled: false,
      name: 'Test User',
    },
  });

  const name = await screen.findByText('Test User');
  const email = screen.getByText('test@example.com');

  expect(name).toBeInTheDocument();
  expect(email).toBeInTheDocument();
});

test('it takes the user to the change email route when they click the change email link', async () => {
  const { user } = setupTest({
    isAuthed: true,
    user: {
      email: 'test@example.com',
      id: 'user_id',
      is2FAEnabled: false,
    },
  });

  const changeEmailLink = await screen.findByText('Change Email');

  await user.click(changeEmailLink);

  const changeEmailRoute = await screen.findByText('CHANGE_EMAIL_ROUTE');

  expect(changeEmailRoute).toBeInTheDocument();
});

test('it takes the user to the change password route when they click the change password link', async () => {
  const { user } = setupTest({
    isAuthed: true,
    user: {
      email: 'test@example.com',
      id: 'user_id',
      is2FAEnabled: false,
    },
  });

  const changePasswordLink = await screen.findByText('Change Password');

  await user.click(changePasswordLink);

  const changePasswordRoute = await screen.findByText('CHANGE_PASSWORD_ROUTE');

  expect(changePasswordRoute).toBeInTheDocument();
});

test('it shows an enable 2FA button when the user has not enabled 2FA', async () => {
  setupTest({
    isAuthed: true,
    user: {
      email: 'test@example.com',
      id: 'user_id',
      is2FAEnabled: false,
    },
  });

  const enable2FAButton = await screen.findByRole('button', {
    name: 'Enable 2FA',
  });

  expect(enable2FAButton).toBeInTheDocument();
});

test('it displays a 2FA status enabled message when the user has enabled 2FA', async () => {
  setupTest({
    isAuthed: true,
    user: {
      email: 'test@example.com',
      id: 'user_id',
      is2FAEnabled: true,
    },
  });

  const twoFactorStatus = await screen.findByText(
    'You have enabled two-factor authentication.',
  );

  const disable2FAButton = await screen.findByRole('button', {
    name: 'Disable 2FA',
  });

  expect(twoFactorStatus).toBeInTheDocument();
  expect(disable2FAButton).toBeInTheDocument();
});

test('it shows a generic error if the enable 2FA mutation fails', async () => {
  server.use(
    graphql.mutation('StartEnable2FA', () => {
      throw new GraphQLError('Something went wrong');
    }),
  );

  const { user } = setupTest({
    isAuthed: true,
    user: {
      email: 'test@example.com',
      id: 'user_id',
      is2FAEnabled: false,
    },
  });

  const enable2FAButton = await screen.findByRole('button', {
    name: 'Enable 2FA',
  });

  await user.click(enable2FAButton);

  const error = await screen.findByText('Something went wrong');

  expect(error).toBeInTheDocument();
});

test('it shows a generic error if the disable 2FA mutation fails', async () => {
  server.use(
    graphql.mutation('StartDisable2FA', () => {
      throw new GraphQLError('Something went wrong');
    }),
  );

  const { user } = setupTest({
    isAuthed: true,
    user: {
      email: 'test@example.com',
      id: 'user_id',
      is2FAEnabled: true,
    },
  });

  const disable2FAButton = await screen.findByRole('button', {
    name: 'Disable 2FA',
  });

  await user.click(disable2FAButton);

  const error = await screen.findByText('Something went wrong');

  expect(error).toBeInTheDocument();
});
