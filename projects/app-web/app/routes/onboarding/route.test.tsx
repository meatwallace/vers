import { afterEach, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { drop } from '@mswjs/data';
import { db } from '~/mocks/db.ts';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { withRouteProps } from '~/test-utils/with-route-props.tsx';
import { withSession } from '~/test-utils/with-session.ts';
import { Routes } from '~/types.ts';
import { action, loader, Onboarding } from './route.tsx';

interface TestConfig {
  email?: string;
  isAuthed: boolean;
  isOnboarding: boolean;
  transactionToken?: string;
}

function setupTest(config: TestConfig) {
  const user = userEvent.setup();

  let _loader = loader;
  let _action = action;

  if (config.isAuthed) {
    _loader = withAuthedUser(_loader);
    _action = withAuthedUser(_action);
  }

  const email =
    typeof config.email === 'string' ? config.email : 'user@test.com';

  const transactionToken =
    typeof config.transactionToken === 'string'
      ? config.transactionToken
      : '1234567890';

  if (config.isOnboarding) {
    _loader = withSession(_loader, {
      onboardingEmail: email,
      transactionToken,
    });

    _action = withSession(_action, {
      onboardingEmail: email,
      transactionToken,
    });
  }

  const OnboardingStub = createRoutesStub([
    {
      // @ts-expect-error(#35) - react router test types are out of date
      action: _action,
      Component: withRouteProps(Onboarding),
      // @ts-expect-error(#35) - react router test types are out of date
      loader: _loader,
      path: '/',
    },
    {
      Component: () => 'DASHBOARD_ROUTE',
      path: Routes.Dashboard,
    },
    {
      Component: () => 'SIGNUP_ROUTE',
      path: Routes.Signup,
    },
  ]);

  render(<OnboardingStub />);

  return { user };
}

afterEach(() => {
  drop(db);
});

test('it redirects to the signup route when no email is stored in the verification session', async () => {
  setupTest({
    email: '',
    isAuthed: false,
    isOnboarding: false,
  });

  const signupRoute = await screen.findByText('SIGNUP_ROUTE');

  expect(signupRoute).toBeInTheDocument();
});

test('it redirects to the signup route when no transaction token is stored in the verification session', async () => {
  setupTest({
    isAuthed: false,
    isOnboarding: false,
    transactionToken: '',
  });

  const signupRoute = await screen.findByText('SIGNUP_ROUTE');

  expect(signupRoute).toBeInTheDocument();
});

test('it redirects to the dashboard route when authenticated', async () => {
  setupTest({ isAuthed: true, isOnboarding: true });

  const dashboardRoute = await screen.findByText('DASHBOARD_ROUTE');

  expect(dashboardRoute).toBeInTheDocument();
});

test('it renders the onboarding form', async () => {
  setupTest({ isAuthed: false, isOnboarding: true });

  const usernameInput = await screen.findByLabelText('Username');
  const nameInput = screen.getByLabelText('Name');
  const passwordInput = screen.getByLabelText('Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm Password');
  const agreeToTermsCheckbox = screen.getByRole('checkbox', {
    name: 'Agree to terms',
  });

  const rememberMeCheckbox = screen.getByRole('checkbox', {
    name: 'Remember me',
  });

  const submitButton = screen.getByRole('button', {
    name: 'Create an account',
  });

  expect(usernameInput).toBeInTheDocument();
  expect(nameInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(confirmPasswordInput).toBeInTheDocument();
  expect(agreeToTermsCheckbox).toBeInTheDocument();
  expect(rememberMeCheckbox).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test('it shows validation errors for missing required fields', async () => {
  const { user } = setupTest({ isAuthed: false, isOnboarding: true });

  const createAccountButton = await screen.findByText('Create an account');

  await user.click(createAccountButton);

  const usernameError = await screen.findByText('Username is required');
  const nameError = screen.getByText('Name is required');
  const passwordErrors = screen.getAllByText('Password is required');
  const agreeToTermsError = screen.getByText(
    'You must agree to the terms of service and privacy policy',
  );

  expect(usernameError).toBeInTheDocument();
  expect(nameError).toBeInTheDocument();
  expect(passwordErrors).toHaveLength(2);
  expect(agreeToTermsError).toBeInTheDocument();
});

test('it shows validation error for mismatched passwords', async () => {
  const { user } = setupTest({ isAuthed: false, isOnboarding: true });

  const passwordInput = await screen.findByLabelText('Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm Password');
  const createAccountButton = screen.getByText('Create an account');

  await user.type(passwordInput, 'password123');
  await user.type(confirmPasswordInput, 'password456');
  await user.click(createAccountButton);

  const passwordError = await screen.findByText(/passwords must match/i);

  expect(passwordError).toBeInTheDocument();
});

test('it redirects to dashboard on successful account creation', async () => {
  const { user } = setupTest({ isAuthed: false, isOnboarding: true });

  const usernameInput = await screen.findByLabelText('Username');
  const nameInput = screen.getByLabelText('Name');
  const passwordInput = screen.getByLabelText('Password');
  const confirmPasswordInput = screen.getByLabelText('Confirm Password');
  const createAccountButton = screen.getByText('Create an account');
  const agreeToTermsCheckbox = screen.getByRole('checkbox', {
    name: 'Agree to terms',
  });

  await user.type(usernameInput, 'testuser');
  await user.type(nameInput, 'Test User');
  await user.type(passwordInput, 'password123');
  await user.type(confirmPasswordInput, 'password123');
  await user.click(agreeToTermsCheckbox);
  await user.click(createAccountButton);

  const dashboardRoute = await screen.findByText('DASHBOARD_ROUTE');

  expect(dashboardRoute).toBeInTheDocument();
});
