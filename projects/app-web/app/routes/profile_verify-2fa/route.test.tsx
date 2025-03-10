import { afterEach, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { drop } from '@mswjs/data';
import { VerificationType } from '~/gql/graphql.ts';
import { db } from '~/mocks/db.ts';
import { server } from '~/mocks/node.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { withSession } from '~/test-utils/with-session.ts';
import { Routes } from '~/types.ts';
import { action, loader, ProfileVerify2FARoute } from './route.tsx';

interface TestConfig {
  isAuthed?: boolean;
  transactionID?: string;
  user?: {
    email?: string;
    id?: string;
    name?: string;
  };
}

async function setupTest(config: TestConfig = {}) {
  const user = userEvent.setup();

  // Set up session with transaction ID if provided
  const verifySession = await verifySessionStorage.getSession();

  if (config.transactionID) {
    verifySession.set('transactionID', config.transactionID);
  }

  const actionWithSession = withSession(action, {
    transactionID: config.transactionID,
  });

  const ProfileVerify2FAStub = createRoutesStub([
    {
      // @ts-expect-error(#35) - react router test types are out of date
      action: config.isAuthed
        ? withAuthedUser(actionWithSession, { user: config.user })
        : actionWithSession,
      Component: withRouteProps(ProfileVerify2FARoute),
      // @ts-expect-error(#35) - react router test types are out of date
      loader: config.isAuthed
        ? withAuthedUser(loader, { user: config.user })
        : loader,
      path: '/',
    },
    {
      Component: () => 'PROFILE_ROUTE',
      path: Routes.Profile,
    },
    {
      Component: () => 'LOGIN_ROUTE',
      path: Routes.Login,
    },
  ]);

  render(<ProfileVerify2FAStub />);

  return { user };
}

afterEach(() => {
  server.resetHandlers();

  drop(db);
});

test('it redirects to login if the user is not authenticated', async () => {
  await setupTest({ isAuthed: false });

  const loginRoute = await screen.findByText('LOGIN_ROUTE');

  expect(loginRoute).toBeInTheDocument();
});

test('it redirects to profile page if the user has 2FA enabled', async () => {
  db.verification.create({
    target: 'test@example.com',
    type: VerificationType.TwoFactorAuth,
  });

  await setupTest({ isAuthed: true, user: { email: 'test@example.com' } });

  const profileRoute = await screen.findByText('PROFILE_ROUTE');

  expect(profileRoute).toBeInTheDocument();
});

test('it renders the 2FA setup page with QR code and form', async () => {
  db.verification.create({
    target: 'test@example.com',
    type: VerificationType.TwoFactorAuthSetup,
  });

  await setupTest({
    isAuthed: true,
    user: {
      email: 'test@example.com',
    },
  });

  const qrCode = await screen.findByAltText('QR code for 2FA');
  const otpURI = screen.getByText(/otpauth:\/\/totp\/vers:test@example.com/);
  const codeInput = screen.getByLabelText(/code/i);
  const submitButton = screen.getByRole('button', { name: /submit/i });

  expect(qrCode).toBeInTheDocument();
  expect(otpURI).toBeInTheDocument();
  expect(codeInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test('it redirects to profile page on successful 2FA setup', async () => {
  const { user } = await setupTest({
    isAuthed: true,
    transactionID: 'test-transaction-id',
    user: {
      email: 'test@example.com',
    },
  });

  db.verification.create({
    target: 'test@example.com',
    type: VerificationType.TwoFactorAuthSetup,
  });

  const codeInput = await screen.findByLabelText(/code/i);
  const submitButton = screen.getByRole('button', { name: /submit/i });

  await user.type(codeInput, '999999');
  await user.click(submitButton);

  const profileRoute = await screen.findByText('PROFILE_ROUTE');

  expect(profileRoute).toBeInTheDocument();
});

test('it shows validation errors for invalid code', async () => {
  const { user } = await setupTest({
    isAuthed: true,
    transactionID: 'test-transaction-id',
    user: {
      email: 'test@example.com',
    },
  });

  // we still need a verification record for the route to load
  db.verification.create({
    target: 'test@example.com',
    type: VerificationType.TwoFactorAuthSetup,
  });

  const codeInput = await screen.findByLabelText(/code/i);
  const submitButton = screen.getByRole('button', { name: /submit/i });

  await user.type(codeInput, '12345');
  await user.click(submitButton);

  const errorMessage = await screen.findByText(/invalid code/i);

  expect(errorMessage).toBeInTheDocument();
});

test('it shows an error message when verification fails', async () => {
  const { user } = await setupTest({
    isAuthed: true,
    transactionID: 'test-transaction-id',
    user: {
      email: 'test@example.com',
    },
  });

  db.verification.create({
    target: 'test@example.com',
    type: VerificationType.TwoFactorAuthSetup,
  });

  const codeInput = await screen.findByLabelText(/code/i);
  const submitButton = screen.getByRole('button', { name: /submit/i });

  await user.type(codeInput, '123456');
  await user.click(submitButton);

  const errorMessage = await screen.findByText(/invalid verification code/i);

  expect(errorMessage).toBeInTheDocument();
});
