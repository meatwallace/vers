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
      path: '/',
      Component: () => {
        throw config.error;
      },
      ErrorBoundary: RouteErrorBoundary,
    },
  ]);

  return render(<RouteStub />);
}

afterEach(() => {
  vi.clearAllMocks();
});

test('it displays a not found message for 404 errors', () => {
  setupTest({
    error: createMockRouteError({ status: 404, statusText: 'Not Found' }),
  });

  expect(screen.getByText('Page not found')).toBeInTheDocument();
});

test('it displays a server error message for 500 errors', () => {
  setupTest({
    error: createMockRouteError({
      status: 500,
      statusText: 'Internal Server Error',
    }),
  });

  expect(screen.getByText('Internal server error')).toBeInTheDocument();
});

test('it displays the error message for non-route errors', () => {
  setupTest({
    error: new Error('Test error'),
  });

  expect(screen.getByText('Test error')).toBeInTheDocument();
});
