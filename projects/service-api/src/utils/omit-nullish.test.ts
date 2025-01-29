import { expect, test } from 'vitest';
import { omitNullish } from './omit-nullish.ts';

test('it removes null properties from an object', () => {
  const input = {
    name: 'test',
    age: null,
    active: true,
  };

  const result = omitNullish(input);

  expect(result).toStrictEqual({
    name: 'test',
    active: true,
  });
});

test('it removes undefined properties from an object', () => {
  const input = {
    name: 'test',
    age: undefined,
    active: true,
  };

  const result = omitNullish(input);

  expect(result).toStrictEqual({
    name: 'test',
    active: true,
  });
});

test('it preserves falsy values that are not null or undefined', () => {
  const input = {
    name: '',
    count: 0,
    active: false,
    deleted: null,
  };

  const result = omitNullish(input);

  expect(result).toStrictEqual({
    name: '',
    count: 0,
    active: false,
  });
});

test('it returns an empty object when all properties are nullish', () => {
  const input = {
    name: null,
    age: undefined,
  };

  const result = omitNullish(input);

  expect(result).toStrictEqual({});
});
