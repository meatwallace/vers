import { afterEach, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRoutesStub, type LoaderFunction } from 'react-router';
import { drop } from '@mswjs/data';
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
      Component: () => 'TEST_ROUTE',
      // @ts-expect-error(#35) - react router test types are out of date
      loader: config.isAuthed ? withAuthedUser(loader) : undefined,
      path: '/',
    },
    {
      Component: () => 'DASHBOARD_ROUTE',
      path: Routes.Dashboard,
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
