import { expect, test } from 'vitest';
import { combineHeaders } from './combine-headers.server';

test('it combines multiple headers objects', () => {
  const headers1 = new Headers({
    'Content-Type': 'application/json',
    'X-Custom': 'value1',
  });

  const headers2 = new Headers({
    Authorization: 'Bearer token',
    'X-Custom': 'value2',
  });

  const result = combineHeaders(headers1, headers2);

  expect(result.get('Content-Type')).toBe('application/json');
  expect(result.get('Authorization')).toBe('Bearer token');
  expect(result.get('X-Custom')).toBe('value1, value2');
});

test('it handles null headers', () => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });

  const result = combineHeaders(null, headers);

  expect(result.get('Content-Type')).toBe('application/json');
});

test('it handles raw header objects', () => {
  const headers1 = {
    'Content-Type': 'application/json',
  };

  const headers2 = {
    Authorization: 'Bearer token',
  };

  const result = combineHeaders(headers1, headers2);

  expect(result.get('Content-Type')).toBe('application/json');
  expect(result.get('Authorization')).toBe('Bearer token');
});

test('it returns empty headers when no inputs are provided', () => {
  const result = combineHeaders();

  expect([...result.entries()]).toHaveLength(0);
});
