import { expect, test } from 'vitest';
import { createRNG } from '@vers/idle-core';
import { getRandomizedPosition } from './get-randomized-position';

test('it returns a position within the expected range', () => {
  const rng = createRNG(12_345);
  const position = getRandomizedPosition([0, 0], rng);

  expect(position).toMatchInlineSnapshot(`
    [
      -0.188,
      -0.021,
    ]
  `);
});
