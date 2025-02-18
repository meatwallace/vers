import userEvent from '@testing-library/user-event';
import { drop } from '@mswjs/data';
import { render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import { afterEach, expect, test } from 'vitest';
import { server } from '~/mocks/node.ts';
import { db } from '~/mocks/db.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { Routes } from '~/types.ts';
import { VerifyOTP, action, loader } from './verify-otp.tsx';
import { verifySessionStorage } from '~/session/verify-session-storage.server.ts';
import {
  SESSION_KEY_VERIFY_ONBOARDING_EMAIL,
  SESSION_KEY_VERIFY_RESET_PASSWORD_EMAIL,
  SESSION_KEY_VERIFY_RESET_PASSWORD_TOKEN,
} from '~/session/consts.ts';

type TestConfig = {
  initialPath?: string;
};

let setCookieHeader: null | string = null;

const _Response = globalThis.Response;

// stub the global Response object so we can capture the cookie header
vi.stubGlobal(
  'Response',
  vi.fn((body?: BodyInit | null, init?: ResponseInit) => {
    if (init?.headers instanceof Headers) {
      setCookieHeader = init.headers.get('set-cookie');
    }

    return new _Response(body, init);
  }),
);

function setupTest(config: Partial<TestConfig> = {}) {
  const user = userEvent.setup();

  const VerifyOTPStub = createRoutesStub([
    {
      path: '/',
      Component: withRouteProps(VerifyOTP),
      // @ts-expect-error(#35) - react router test types are out of date
      action,
      // @ts-expect-error(#35) - react router test types are out of date
      loader,
    },
    {
      path: Routes.ResetPassword,
      Component: () => 'RESET_PASSWORD_ROUTE',
    },
    {
      path: Routes.Onboarding,
      Component: () => 'ONBOARDING_ROUTE',
    },
    {
      path: Routes.Signup,
      Component: () => 'SIGNUP_ROUTE',
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

  setCookieHeader = null;

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

test('it updates the session then redirects to the reset password route on success', async () => {
  const { user } = setupTest({
    initialPath:
      '/?type=RESET_PASSWORD&target=test@example.com&redirect=/reset-password?token=test_reset_token',
  });

  db.verification.create({
    type: 'RESET_PASSWORD',
    target: 'test@example.com',
  });

  const codeInput = await screen.findByRole('textbox', { name: /code/i });
  const submitButton = screen.getByRole('button', { name: /verify/i });

  await user.type(codeInput, '999999');
  await user.click(submitButton);

  const resetPasswordRoute = await screen.findByText('RESET_PASSWORD_ROUTE');

  expect(resetPasswordRoute).toBeInTheDocument();

  const verifySession = await verifySessionStorage.getSession(setCookieHeader);

  expect(verifySession.get(SESSION_KEY_VERIFY_RESET_PASSWORD_EMAIL)).toBe(
    'test@example.com',
  );

  expect(verifySession.get(SESSION_KEY_VERIFY_RESET_PASSWORD_TOKEN)).toBe(
    'test_reset_token',
  );
});

test('it updates the session then redirects to the onboarding route on success', async () => {
  const { user } = setupTest({
    initialPath: '/?type=ONBOARDING&target=test@example.com',
  });

  db.verification.create({
    type: 'ONBOARDING',
    target: 'test@example.com',
  });

  const codeInput = await screen.findByRole('textbox', { name: /code/i });
  const submitButton = screen.getByRole('button', { name: /verify/i });

  await user.type(codeInput, '999999');
  await user.click(submitButton);

  const onboardingRoute = await screen.findByText('ONBOARDING_ROUTE');

  expect(onboardingRoute).toBeInTheDocument();

  const verifySession = await verifySessionStorage.getSession(setCookieHeader);

  expect(verifySession.get(SESSION_KEY_VERIFY_ONBOARDING_EMAIL)).toBe(
    'test@example.com',
  );
});

test('it shows error for invalid verification code', async () => {
  const { user } = setupTest();

  db.verification.create({
    type: 'RESET_PASSWORD',
    target: 'test@example.com',
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
  });

  const signupRoute = await screen.findByText('SIGNUP_ROUTE');

  expect(signupRoute).toBeInTheDocument();
});
