import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRoutesStub } from 'react-router';
import { action, ErrorBoundary, loader, NotFound } from './route';

test('it renders the error boundary with a page not found message', async () => {
  const SplatStub = createRoutesStub([
    {
      action,
      Component: NotFound,
      ErrorBoundary: ErrorBoundary,
      loader,
      path: '*',
    },
  ]);

  render(<SplatStub />);

  const errorMessage = await screen.findByText(
    "We couldn't find what you were looking for",
  );

  expect(errorMessage).toBeInTheDocument();
});
