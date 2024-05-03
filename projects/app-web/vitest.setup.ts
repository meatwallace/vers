import '@testing-library/jest-dom/vitest';
import * as matchers from 'jest-extended';
import { server } from './app/mocks/node';

expect.extend(matchers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
