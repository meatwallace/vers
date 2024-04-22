import { createRemixStub } from '@remix-run/testing';
import { json } from '@remix-run/react';
import { render, screen, waitFor } from '@testing-library/react';
import IndexRoute from './_index';

const IndexRouteStub = createRemixStub([
  {
    path: '/',
    Component: IndexRoute,
    loader() {
      return json({ message: 'hello, world' });
    },
  },
]);

test('it renders a greeting', async () => {
  render(<IndexRouteStub />);

  await waitFor(() => screen.findByText('hello, world'));
});

test('it renders a greeting from the API', async () => {
  render(<IndexRoute />);

  await waitFor(() => screen.findByText('hello, world'));
});
