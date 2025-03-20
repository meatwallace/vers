import { afterEach, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRoutesStub, ErrorResponse } from 'react-router';
import { RouteErrorBoundary } from './route-error-boundary';

interface TestConfig {
  error: Error | ErrorResponse;
}

function createMockRouteError(
  errorParts: Pick<ErrorResponse, 'status' | 'statusText'>,
): ErrorResponse {
  return {
    data: null,
    // @ts-expect-error - `internal` is not typed but it is required for react-router's
    // util to determine this as a route error
    internal: false,
    ...errorParts,
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

function setupTest(config: TestConfig) {
  vi.spyOn(console, 'error').mockImplementation(noop);

  const RouteStub = createRoutesStub([
    {
      Component: () => {
        throw config.error;
      },
      ErrorBoundary: RouteErrorBoundary,
      path: '/',
    },
  ]);

  return render(<RouteStub />);
}

afterEach(() => {
  vi.clearAllMocks();
});

test('it displays a not found message for 404 errors', async () => {
  setupTest({
    error: createMockRouteError({ status: 404, statusText: 'Not Found' }),
  });

  const errorMessage = await screen.findByText(
    "We couldn't find what you were looking for",
  );

  expect(errorMessage).toBeInTheDocument();
});

test('it displays a generic error message for non-route errors', async () => {
  setupTest({
    error: new Error('Test error'),
  });

  const errorMessage = await screen.findByText('Something went wrong');

  expect(errorMessage).toBeInTheDocument();
});
