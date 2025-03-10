import { afterAll, afterEach, beforeAll, expect } from 'vitest';
import * as matchers from 'jest-extended';
import { server } from './src/mocks/node';

expect.extend(matchers);

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

server.events.on('request:start', ({ request }) => {
  console.log('Outgoing:', request.method, request.url);
});
