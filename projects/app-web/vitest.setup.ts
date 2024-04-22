import '@testing-library/jest-dom/matchers';
// import { installGlobals } from '@remix-run/node';
import { server } from './app/mocks/node';

// disabled until this becomes an issue. it bricks MSW's graphql response or graphql-request's
// ability to interpret a success - can confirm if needed later.
// installGlobals();

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
