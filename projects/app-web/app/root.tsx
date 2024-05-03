import { MetaFunction } from '@remix-run/node';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import * as styles from './global.css.ts';

// quick hack to ensure our global styles are kept in the prod build -
// can clean this up later.
console.log('loaded global styles', styles);

export const meta: MetaFunction = () => [
  {
    // eslint-disable-next-line unicorn/text-encoding-identifier-case
    charset: 'utf-8',
    title: 'Chrononomicon',
    viewport: 'width=device-width,initial-scale=1',
  },
];

export function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default App;
