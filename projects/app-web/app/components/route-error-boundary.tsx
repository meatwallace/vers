import { useEffect } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router';
import { getErrorMessage } from '~/utils/get-error-message';
import * as styles from './route-error-boundary.css.ts';

export function RouteErrorBoundary() {
  const error = useRouteError();

  if (typeof document !== 'undefined') {
    console.error(error);
  }

  // TODO(#16): Add Sentry error capture
  useEffect(() => {
    // captureException(error);
  }, [error]);

  const isRouteError = isRouteErrorResponse(error);

  // TODO(#30): nicer catch-all error page
  if (isRouteError && error.status === 404) {
    return (
      <div className={styles.container}>
        <h1>404</h1>
        <p>Page not found</p>
      </div>
    );
  }

  if (isRouteError && error.status === 500) {
    return (
      <div className={styles.container}>
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
    <div className={styles.container}>
      <h1>Error</h1>
      <p>{errorMessage}</p>
    </div>
  );
}
