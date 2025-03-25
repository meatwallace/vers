import { expect, test } from 'vitest';
import { getInitialState } from './get-initial-state';

test('it returns the initial state', () => {
  const state = getInitialState();

  expect(state).toStrictEqual({ lastAttackTime: 0 });
});
