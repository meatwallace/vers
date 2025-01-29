import { afterEach, expect, test } from 'vitest';
import { createRoutesStub, type LoaderFunction } from 'react-router';
import { render, screen } from '@testing-library/react';
import { drop } from '@mswjs/data';
import { db } from '~/mocks/db.ts';
import { withAuthedUser } from '~/test-utils/with-authed-user.ts';
import { Routes } from '~/types.ts';
import { requireAnonymous } from './require-anonymous.server.ts';

type TestConfig = {
  isAuthed?: boolean;
};

const loader: LoaderFunction = async ({ request }) => {
  await requireAnonymous(request);

  return null;
};

async function setupTest(config: Partial<TestConfig> = {}) {
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
  await setupTest();

  const testRoute = await screen.findByText('TEST_ROUTE');

  expect(testRoute).toBeInTheDocument();
});

test('it redirects to dashboard when a session exists', async () => {
  await setupTest({ isAuthed: true });

  const dashboardRoute = await screen.findByText('DASHBOARD_ROUTE');

  expect(dashboardRoute).toBeInTheDocument();
});
