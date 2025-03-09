import { afterEach, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { drop } from '@mswjs/data';
import { db } from '~/mocks/db.ts';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { Routes } from '~/types.ts';
import { loader, Profile } from './route.tsx';

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
      Component: withRouteProps(Profile),
      // @ts-expect-error(#35) - react router test types are out of date
      loader: config.isAuthed
        ? // @ts-expect-error(#35) - react router test types are out of date
          withAuthedUser(loader, { user: config.user })
        : loader,
      path: '/',
    },
    {
      Component: () => 'LOGIN_ROUTE',
      path: Routes.Login,
    },
  ]);

  render(<ProfileStub />);

  return { user };
}

afterEach(() => {
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

test('it shows an enable 2FA button when the user has not enabled 2FA', async () => {
  setupTest({
    isAuthed: true,
    user: {
      email: 'test@example.com',
      id: 'user_id',
      is2FAEnabled: false,
      name: 'Test User',
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
      name: 'Test User',
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
