import { expect, test } from 'vitest';
import { hashObject } from './hash-object';

test('returns consistent hash for the same object', () => {
  const obj = { a: 1, b: 'test', c: true };

  const hash1 = hashObject(obj);
  const hash2 = hashObject(obj);

  expect(hash1).toBe(hash2);
});

test('returns different hashes for different objects', () => {
  const obj1 = { a: 1, b: 'test', c: true };
  const obj2 = { a: 1, b: 'test', c: false };

  const hash1 = hashObject(obj1);
  const hash2 = hashObject(obj2);

  expect(hash1).not.toBe(hash2);
});
