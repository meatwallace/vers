import { renderToPipeableStream } from 'react-dom/server';
import type {
  ActionFunctionArgs,
  EntryContext,
  LoaderFunctionArgs,
} from 'react-router';
import { ServerRouter } from 'react-router';
import { PassThrough } from 'node:stream';
import { styleText } from 'node:util';
import { createReadableStreamFromReadable } from '@react-router/node';
import * as Sentry from '@sentry/node';
import { isbot } from 'isbot';

export const streamTimeout = 5000;

if (!import.meta.env.PROD && import.meta.env.VITE_ENABLE_MSW === 'true') {
  const { server } = await import('./mocks/node');

  server.listen();
}

// if we're in dev mode, load our local environment variables which should include our server secrets
if (!import.meta.env.PROD) {
  process.loadEnvFile('.env.development.local');
}

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
) {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    responseHeaders.append('Document-Policy', 'js-profiling');
  }

  const prohibitOutOfOrderStreaming =
    isBotRequest(request.headers.get('user-agent')) ||
    reactRouterContext.isSpaMode;

  return prohibitOutOfOrderStreaming
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        reactRouterContext,
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        reactRouterContext,
      );
}

export function handleError(
  error: unknown,
  { request }: ActionFunctionArgs | LoaderFunctionArgs,
) {
  // Skip capturing if the request is aborted as Remix docs suggest
  // Ref: https://remix.run/docs/en/main/file-conventions/entry.server#handleerror
  if (request.signal.aborted) {
    return;
  }

  if (error instanceof Error) {
    console.error(styleText('red', String(error.stack)));
  } else {
    console.error(error);
  }

  Sentry.captureException(error);
}

function isBotRequest(userAgent: null | string) {
  if (!userAgent) {
    return false;
  }

  return isbot(userAgent);
}

function handleBotRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;

    const { abort, pipe } = renderToPipeableStream(
      <ServerRouter context={reactRouterContext} url={request.url} />,
      {
        onAllReady() {
          shellRendered = true;

          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
        onError(error: unknown) {
          responseStatusCode = 500;

          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
        onShellError(error: unknown) {
          reject(error as Error);
        },
      },
    );

    setTimeout(abort, streamTimeout + 1000);
  });
}

function handleBrowserRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;

    const { abort, pipe } = renderToPipeableStream(
      <ServerRouter context={reactRouterContext} url={request.url} />,
      {
        onError(error: unknown) {
          responseStatusCode = 500;

          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
        onShellError(error: unknown) {
          reject(error as Error);
        },
        onShellReady() {
          shellRendered = true;

          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            }),
          );

          pipe(body);
        },
      },
    );

    setTimeout(abort, streamTimeout + 1000);
  });
}
