import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRemixStub } from '@remix-run/testing';
import { drop } from '@mswjs/data';
import { Dashboard, loader } from './dashboard';
import { Routes } from '../types';
import { db } from '../mocks/db';
import { client } from '../client';

function ExpectedRoute() {
  return 'Logged out';
}

const MOCK_TOKEN = `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ0ZXN0IiwiaWF0IjoxNzE0NDA5NTMxLCJleHAiOjE3NDU5NDU1MzEsImF1ZCI6Ind3dy50ZXN0LmNvbSIsInN1YiI6ImF1dGgwfHRlc3RfaWQifQ.Drta5B74QNaMfKpZtFyCde5YG-e1eTU6tySwknytnig`;

function setupTest() {
  const user = userEvent.setup();

  const DashboardStub = createRemixStub([
    { path: '/', Component: Dashboard, loader },
    { path: Routes.AuthLogout, Component: ExpectedRoute, action: () => null },
  ]);

  client.setHeader('authorization', MOCK_TOKEN);

  db.user.create({
    auth0ID: 'auth0|test_id',
    firstName: 'John',
  });

  render(<DashboardStub />);

  return { user };
}

function teardownTest() {
  drop(db);

  client.setHeader('authorization', '');
}

test('it renders the users name', async () => {
  setupTest();

  const greeting = await screen.findByText('John');

  expect(greeting).toBeInTheDocument();

  teardownTest();
});

test('it renders a log out button that navigates to the logout route when clicked', async () => {
  const { user } = setupTest();

  const logOutButton = await screen.findByRole('button', { name: 'Log out' });

  await waitFor(() => user.click(logOutButton));

  const loggedOutMessage = await screen.findByText('Logged out');

  expect(loggedOutMessage).toBeInTheDocument();

  teardownTest();
});
