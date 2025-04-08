import { expect, test } from 'vitest';
import { omitNullish } from './omit-nullish';

test('it removes null properties from an object', () => {
  const input = {
    active: true,
    age: null,
    name: 'test',
  };

  const result = omitNullish(input);

  expect(result).toStrictEqual({
    active: true,
    name: 'test',
  });
});

test('it removes undefined properties from an object', () => {
  const input = {
    active: true,
    age: undefined,
    name: 'test',
  };

  const result = omitNullish(input);

  expect(result).toStrictEqual({
    active: true,
    name: 'test',
  });
});

test('it preserves falsy values that are not null or undefined', () => {
  const input = {
    active: false,
    count: 0,
    deleted: null,
    name: '',
  };

  const result = omitNullish(input);

  expect(result).toStrictEqual({
    active: false,
    count: 0,
    name: '',
  });
});

test('it returns an empty object when all properties are nullish', () => {
  const input = {
    age: undefined,
    name: null,
  };

  const result = omitNullish(input);

  expect(result).toStrictEqual({});
});
