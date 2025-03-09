import { afterEach, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { drop } from '@mswjs/data';
import { db } from '~/mocks/db.ts';
import { server } from '~/mocks/node.ts';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { Routes } from '~/types.ts';
import { action, loader, Signup } from './route.tsx';

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

interface TestConfig {
  isAuthed: boolean;
}

function setupTest(config: TestConfig) {
  const user = userEvent.setup();

  const SignupStub = createRoutesStub([
    {
      // @ts-expect-error(#35) - react router test types are out of date
      action: config.isAuthed ? withAuthedUser(action) : action,
      Component: withRouteProps(Signup),
      // @ts-expect-error(#35) - react router test types are out of date
      loader: config.isAuthed ? withAuthedUser(loader) : loader,
      path: '/',
    },
    {
      Component: () => 'VERIFY_OTP_ROUTE',
      path: Routes.VerifyOTP,
    },
    {
      Component: () => 'DASHBOARD_ROUTE',
      path: Routes.Dashboard,
    },
  ]);

  render(<SignupStub />);

  return { user };
}

afterEach(() => {
  server.resetHandlers();

  drop(db);
});

test('it renders the signup form with accessible elements', async () => {
  setupTest({ isAuthed: false });

  const emailInput = await screen.findByRole('textbox', { name: /email/i });
  const submitButton = screen.getByRole('button', { name: /signup/i });

  expect(emailInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test('it shows validation error for invalid email', async () => {
  const { user } = setupTest({ isAuthed: false });

  const emailInput = await screen.findByRole('textbox', { name: /email/i });
  const submitButton = screen.getByRole('button', { name: /signup/i });

  await user.type(emailInput, 'invalid-email');
  await user.click(submitButton);

  const errorMessage = await screen.findByText('Email is invalid');

  expect(errorMessage).toBeInTheDocument();
});

test('it shows validation error when email is missing', async () => {
  const { user } = setupTest({ isAuthed: false });

  const submitButton = await screen.findByRole('button', { name: /signup/i });

  await user.click(submitButton);

  const errorMessage = await screen.findByText('Email is required');

  expect(errorMessage).toBeInTheDocument();
});

test('it redirects to verify OTP page on successful signup', async () => {
  const { user } = setupTest({ isAuthed: false });

  const emailInput = await screen.findByRole('textbox', { name: /email/i });
  const submitButton = screen.getByRole('button', { name: /signup/i });

  await user.type(emailInput, 'test@example.com');
  await user.click(submitButton);

  const verifyOTPRoute = await screen.findByText('VERIFY_OTP_ROUTE');

  expect(verifyOTPRoute).toBeInTheDocument();

  const verifySession = await verifySessionStorage.getSession(cookieHeader);

  expect(verifySession.get('transactionID')).toBe('valid-transaction-id');
});

test('it redirects to the dashboard route when already authenticated', async () => {
  setupTest({ isAuthed: true });

  expect(await screen.findByText('DASHBOARD_ROUTE')).toBeInTheDocument();
});
