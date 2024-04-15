import { resolve } from './hello';

test('it returns a greeting', () => {
  const result = resolve({}, {});

  expect(result).toBe('hello, world');
});

test('it returns a specific greeting when provided a name', () => {
  const result = resolve({}, { name: 'user' });

  expect(result).toBe('hello, user');
});
