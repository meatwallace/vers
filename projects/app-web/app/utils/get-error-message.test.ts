import { expect, test } from 'vitest';
import { getErrorMessage } from './get-error-message';

test('it returns string errors as is', () => {
  expect(getErrorMessage('Test error')).toBe('Test error');
});

test('it extracts message from error objects', () => {
  expect(getErrorMessage(new Error('Test error'))).toBe('Test error');
});

test('it extracts message from error-like objects', () => {
  expect(getErrorMessage({ message: 'Test error' })).toBe('Test error');
});

test('it returns a fallback for non-error values', () => {
  expect(getErrorMessage({})).toBe('An unknown error occurred');
  expect(getErrorMessage(null)).toBe('An unknown error occurred');
  expect(getErrorMessage(void 0)).toBe('An unknown error occurred');
  expect(getErrorMessage({ foo: 'bar' })).toBe('An unknown error occurred');
});
