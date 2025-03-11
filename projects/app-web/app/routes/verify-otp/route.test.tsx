import { afterEach, expect, test, vi } from 'vitest';
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
import { action, loader, VerifyOTPRoute } from './route.tsx';

interface TestConfig {
  initialPath?: string;
  isAuthed?: boolean;
  transactionID?: string;
  unverifiedSessionID?: string;
  user?: {
    email?: string;
  };
}

let cookieHeader: null | string = null;

const _Response = globalThis.Response;

// stub the global Response object so we can capture the cookie header
vi.stubGlobal(
  'Response',
  vi.fn((body?: BodyInit | null, init?: ResponseInit) => {
    if (init?.headers instanceof Headers) {
      cookieHeader = init.headers.get('set-cookie');
    }

    return new _Response(body, init);
  }),
);

function setupTest(config: TestConfig = {}) {
  const user = userEvent.setup();

  let wrappedAction = withSession(action, config);

  if (config.isAuthed) {
    wrappedAction = withAuthedUser(wrappedAction, { user: config.user });
  }

  const VerifyOTPStub = createRoutesStub([
    {
      action: wrappedAction,
      Component: withRouteProps(VerifyOTPRoute),
      ErrorBoundary: () => 'ERROR_BOUNDARY',
      loader,
      path: '/',
    },
    {
      Component: () => 'RESET_PASSWORD_ROUTE',
      path: Routes.ResetPassword,
    },
    {
      Component: () => 'ONBOARDING_ROUTE',
      path: Routes.Onboarding,
    },
    {
      Component: () => 'SIGNUP_ROUTE',
      path: Routes.Signup,
    },
    {
      Component: () => 'PROFILE_ROUTE',
      path: Routes.Profile,
    },
    {
      Component: () => 'DASHBOARD_ROUTE',
      path: Routes.Dashboard,
    },
  ]);

  render(
    <VerifyOTPStub
      initialEntries={[
        config.initialPath ?? '/?type=RESET_PASSWORD&target=test@example.com',
      ]}
    />,
  );

  return { user };
}

afterEach(() => {
  drop(db);

  cookieHeader = null;

  server.resetHandlers();
});

test('it renders the verify OTP form with accessible elements', async () => {
  setupTest();

  const codeInput = await screen.findByRole('textbox', { name: /code/i });
  const submitButton = screen.getByRole('button', { name: /verify/i });

  expect(codeInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test('it shows validation errors for invalid code', async () => {
  const { user } = setupTest();

  const codeInput = await screen.findByRole('textbox', { name: /code/i });
  const submitButton = screen.getByRole('button', { name: /verify/i });

  await user.type(codeInput, '12345'); // Too short
  await user.click(submitButton);

  const errorText = await screen.findByText(/invalid code/i);

  expect(errorText).toBeInTheDocument();
});

test('it handles reset password verification and redirects to the reset password route on success', async () => {
  const { user } = setupTest({
    initialPath:
      '/?type=RESET_PASSWORD&target=test@example.com&redirect=/reset-password?token=test_reset_token',
    transactionID: 'test_transaction_id',
  });

  db.verification.create({
    target: 'test@example.com',
    type: VerificationType.ResetPassword,
  });

  const codeInput = await screen.findByRole('textbox', { name: /code/i });
  const submitButton = screen.getByRole('button', { name: /verify/i });

  await user.type(codeInput, '999999');
  await user.click(submitButton);

  const resetPasswordRoute = await screen.findByText('RESET_PASSWORD_ROUTE');

  expect(resetPasswordRoute).toBeInTheDocument();

  const verifySession = await verifySessionStorage.getSession(cookieHeader);

  expect(verifySession.get('transactionToken')).toBe('valid_transaction_token');
});

test('it handles onboarding verification and redirects to the onboarding route on success', async () => {
  const { user } = setupTest({
    initialPath: '/?type=ONBOARDING&target=test@example.com',
    transactionID: 'test_transaction_id',
  });

  db.verification.create({
    target: 'test@example.com',
    type: VerificationType.Onboarding,
  });

  const codeInput = await screen.findByRole('textbox', { name: /code/i });
  const submitButton = screen.getByRole('button', { name: /verify/i });

  await user.type(codeInput, '999999');
  await user.click(submitButton);

  const onboardingRoute = await screen.findByText('ONBOARDING_ROUTE');

  expect(onboardingRoute).toBeInTheDocument();

  const verifySession = await verifySessionStorage.getSession(cookieHeader);

  expect(verifySession.get('onboardingEmail')).toBe('test@example.com');
  expect(verifySession.get('transactionToken')).toBe('valid_transaction_token');
});

test('it handles 2FA setup verification and throws an error', async () => {
  const { user } = setupTest({
    initialPath: '/?type=TWO_FACTOR_AUTH_SETUP&target=test@example.com',
    transactionID: 'test_transaction_id',
  });

  db.verification.create({
    target: 'test@example.com',
    type: VerificationType.TwoFactorAuthSetup,
  });

  const codeInput = await screen.findByRole('textbox', { name: /code/i });
  const submitButton = screen.getByRole('button', { name: /verify/i });

  await user.type(codeInput, '999999');
  await user.click(submitButton);

  const errorBoundary = await screen.findByText(/ERROR_BOUNDARY/i);

  expect(errorBoundary).toBeInTheDocument();
});

test('it handles 2FA disable verification and redirects to the profile route on success', async () => {
  const { user } = setupTest({
    initialPath: '/?type=TWO_FACTOR_AUTH_DISABLE&target=test@example.com',
    isAuthed: true,
    transactionID: 'test_transaction_id',
    user: {
      email: 'test@example.com',
    },
  });

  db.verification.create({
    target: 'test@example.com',
    type: VerificationType.TwoFactorAuth,
  });

  db.verification.create({
    target: 'test@example.com',
    type: VerificationType.TwoFactorAuthDisable,
  });

  const codeInput = await screen.findByRole('textbox', { name: /code/i });
  const submitButton = screen.getByRole('button', { name: /verify/i });

  await user.type(codeInput, '999999');
  await user.click(submitButton);

  const profileRoute = await screen.findByText('PROFILE_ROUTE');

  expect(profileRoute).toBeInTheDocument();

  const twoFactorAuth = db.verification.findFirst({
    where: {
      target: { equals: 'test@example.com' },
      type: { equals: VerificationType.TwoFactorAuth },
    },
  });

  const twoFactorAuthDisable = db.verification.findFirst({
    where: {
      target: { equals: 'test@example.com' },
      type: { equals: VerificationType.TwoFactorAuthDisable },
    },
  });

  expect(twoFactorAuth).toBeNull();
  expect(twoFactorAuthDisable).toBeNull();
});

test('it handles 2FA login verification and redirects to the dashboard on success', async () => {
  db.user.create({
    email: 'test@example.com',
  });

  const { user } = setupTest({
    initialPath: '/?type=TWO_FACTOR_AUTH&target=test@example.com',
    transactionID: 'test_transaction_id',
    unverifiedSessionID: 'test_unverified_session_id',
  });

  db.verification.create({
    target: 'test@example.com',
    type: VerificationType.TwoFactorAuth,
  });

  const codeInput = await screen.findByRole('textbox', { name: /code/i });
  const submitButton = screen.getByRole('button', { name: /verify/i });

  await user.type(codeInput, '999999');
  await user.click(submitButton);

  const dashboardRoute = await screen.findByText('DASHBOARD_ROUTE');

  expect(dashboardRoute).toBeInTheDocument();
});

test.todo(
  'it handles change email verification and redirects to the profile route on success',
);

test.todo(
  'it handles change password verification and redirects to the profile route on success',
);

test('it shows error for invalid verification code', async () => {
  const { user } = setupTest({
    transactionID: 'test_transaction_id',
  });

  db.verification.create({
    target: 'test@example.com',
    type: VerificationType.ResetPassword,
  });

  const codeInput = await screen.findByRole('textbox', { name: /code/i });
  const submitButton = screen.getByRole('button', { name: /verify/i });

  await user.type(codeInput, '654321'); // Wrong code
  await user.click(submitButton);

  const errorText = await screen.findByText(/invalid verification code/i);

  expect(errorText).toBeInTheDocument();
});

test('it redirects to signup for invalid verification type', async () => {
  setupTest({
    initialPath: '/?type=INVALID_TYPE&target=test@example.com',
    transactionID: 'test_transaction_id',
  });

  const signupRoute = await screen.findByText('SIGNUP_ROUTE');

  expect(signupRoute).toBeInTheDocument();
});
