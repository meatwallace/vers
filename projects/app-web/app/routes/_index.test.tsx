import { render, screen, waitFor } from '@testing-library/react';
import { createRemixStub } from '@remix-run/testing';
import IndexRoute, { loader } from './_index';

function setupTest() {
  const IndexRouteStub = createRemixStub([
    {
      path: '/',
      Component: IndexRoute,
      loader,
    },
  ]);

  render(<IndexRouteStub />);
}

test('it renders a greeting', async () => {
  setupTest();

  await waitFor(() => screen.findByText('hello, world'));
});
