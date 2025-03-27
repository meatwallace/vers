import { expect, test } from 'vitest';
import { getSeed } from './get-seed';

test('it returns a seed of the correct length', () => {
  const seed = getSeed();

  expect(seed.toString()).toHaveLength(10);
});
