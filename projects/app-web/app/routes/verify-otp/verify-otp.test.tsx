import userEvent from '@testing-library/user-event';
import { drop } from '@mswjs/data';
import { render, screen } from '@testing-library/react';
import { graphql } from 'msw';
import { createRoutesStub } from 'react-router';
import { afterEach, expect, test } from 'vitest';
import { server } from '~/mocks/node.ts';
import { db } from '~/mocks/db.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { Routes } from '~/types.ts';
import { VerifyOTP, action, loader } from './verify-otp.tsx';

type TestConfig = {
  initialPath: string;
};

function setupTest(config: TestConfig) {
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
      path: Routes.Login,
      Component: withRouteProps(VerifyOTP),
      // @ts-expect-error(#35) - react router test types are out of date
      loader,
      // @ts-expect-error(#35) - react router test types are out of date
      action,
    },
    {
      path: Routes.Signup,
      Component: () => 'SIGNUP_ROUTE',
    },
    {
      path: Routes.Onboarding,
      Component: () => 'ONBOARDING_ROUTE',
    },
  ]);

  render(<VerifyOTPStub initialEntries={[config.initialPath]} />);

  return { user };
}

afterEach(() => {
  drop(db);

  server.resetHandlers();
});

test('it redirects to signup for invalid verification type', async () => {
  setupTest({ initialPath: '/?type=invalid' });

  const signupRoute = await screen.findByText('SIGNUP_ROUTE');
  expect(signupRoute).toBeInTheDocument();
});

test('it renders the verify OTP form', async () => {
  setupTest({ initialPath: '/?type=ONBOARDING' });

  const otpInput = await screen.findByRole('textbox', { name: /code/i });
  const verifyButton = screen.getByRole('button', { name: /verify/i });

  expect(otpInput).toBeInTheDocument();
  expect(verifyButton).toBeInTheDocument();
});

test('it shows a validation error for invalid OTP code', async () => {
  const { user } = setupTest({ initialPath: '/?type=ONBOARDING' });

  const otpInput = await screen.findByRole('textbox', { name: /code/i });
  const verifyButton = screen.getByRole('button', { name: /verify/i });

  await user.type(otpInput, '12345');
  await user.click(verifyButton);

  const errorMessage = await screen.findByText('Invalid code');

  expect(errorMessage).toBeInTheDocument();
});

test('it redirects to the onboarding page on successful verification', async () => {
  db.verification.create({
    target: 'test@example.com',
    type: 'ONBOARDING',
  });

  const { user } = setupTest({
    initialPath: '/?type=ONBOARDING&target=test@example.com',
  });

  const otpInput = await screen.findByRole('textbox', { name: /code/i });
  const verifyButton = screen.getByRole('button', { name: /verify/i });

  await user.type(otpInput, '999999');
  await user.click(verifyButton);

  const onboardingRoute = await screen.findByText('ONBOARDING_ROUTE');

  expect(onboardingRoute).toBeInTheDocument();
});

test('it shows error message when verification fails', async () => {
  server.use(
    graphql.mutation('VerifyOTP', async () => {
      throw new Error('Internal server error');
    }),
  );

  const { user } = setupTest({
    initialPath: '/?type=ONBOARDING&target=test@example.com',
  });

  const otpInput = await screen.findByRole('textbox', { name: /code/i });
  const verifyButton = screen.getByRole('button', { name: /verify/i });

  await user.type(otpInput, '123456');
  await user.click(verifyButton);

  const errorMessage = await screen.findByText(/something went wrong/i);

  expect(errorMessage).toBeInTheDocument();
});
