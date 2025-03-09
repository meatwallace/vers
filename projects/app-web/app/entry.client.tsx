import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from 'react-router/dom';

const SILENCED_UNHANDLED_URLS = [
  '/__manifest',
  '.woff',
  '.svg',
  '.css',
  '.png',
  '.ts',
  '.tsx',
  '.data',
];

async function prepareApp() {
  if (!import.meta.env.PROD && import.meta.env.VITE_ENABLE_MSW === 'true') {
    const { worker } = await import('./mocks/browser');

    return worker.start({
      onUnhandledRequest: (req, print) => {
        if (SILENCED_UNHANDLED_URLS.some((url) => req.url.includes(url))) {
          return;
        }

        print.warning();
      },
    });
  }
}

// eslint-disable-next-line unicorn/prefer-top-level-await
void prepareApp().then(() =>
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <HydratedRouter />
      </StrictMode>,
    );
  }),
);
