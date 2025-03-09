import { afterEach, expect, test } from 'vitest';
import { type LoaderFunction, createRoutesStub } from 'react-router';
import { drop } from '@mswjs/data';
import { render, screen } from '@testing-library/react';
import { db } from '~/mocks/db.ts';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { Routes } from '~/types.ts';
import { requireAnonymous } from './require-anonymous.server.ts';

interface TestConfig {
  isAuthed?: boolean;
}

const loader: LoaderFunction = async ({ request }) => {
  await requireAnonymous(request);

  return null;
};

function setupTest(config: TestConfig = {}) {
  const TestRoutesStub = createRoutesStub([
    {
      path: '/',
      Component: () => 'TEST_ROUTE',
      loader: config.isAuthed ? withAuthedUser(loader) : undefined,
    },
    {
      path: Routes.Dashboard,
      Component: () => 'DASHBOARD_ROUTE',
    },
  ]);

  render(<TestRoutesStub />);
}

afterEach(() => {
  drop(db);
});

test('it allows access when no session exists', async () => {
  setupTest();

  const testRoute = await screen.findByText('TEST_ROUTE');

  expect(testRoute).toBeInTheDocument();
});

test('it redirects to dashboard when a session exists', async () => {
  setupTest({ isAuthed: true });

  const dashboardRoute = await screen.findByText('DASHBOARD_ROUTE');

  expect(dashboardRoute).toBeInTheDocument();
});
