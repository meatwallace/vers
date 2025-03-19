import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRoutesStub } from 'react-router';
import { Header } from './header';

interface TestConfig {
  username: string;
}

function setupTest(config: TestConfig) {
  const user = userEvent.setup();

  const HeaderStub = createRoutesStub([
    {
      Component: () => <Header user={{ username: config.username }} />,
      path: '/',
    },
  ]);

  render(<HeaderStub />);

  return { user };
}

test("it displays the user's `username`", async () => {
  setupTest({ username: 'test_user' });

  const username = await screen.findByText('test_user');

  expect(username).toBeInTheDocument();
});
