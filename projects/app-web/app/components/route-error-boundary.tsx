import { useEffect } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router';
import { captureException } from '@sentry/react';
import { getErrorMessage } from '~/utils/get-error-message';

export function RouteErrorBoundary() {
  const error = useRouteError();

  if (typeof document !== 'undefined') {
    console.error(error);
  }

  const isRouteError = isRouteErrorResponse(error);

  useEffect(() => {
    if (!isRouteError) {
      captureException(error);
    }
  }, [error, isRouteError]);

  // TODO(#30): nicer catch-all error page
  if (isRouteError && error.status === 404) {
    return (
      <div>
        <h1>404</h1>
        <p>Page not found</p>
      </div>
    );
  }

  if (isRouteError && error.status === 500) {
    return (
      <div>
        <h1>500</h1>
        <p>Internal server error</p>
      </div>
    );
  }

  const errorMessage =
    process.env.NODE_ENV === 'development'
      ? getErrorMessage(error)
      : 'An unknown error occurred';

  return (
    <div>
      <h1>Error</h1>
      <p>{errorMessage}</p>
    </div>
  );
}
