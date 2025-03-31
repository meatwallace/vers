import type { RNG } from '@vers/idle-core';

const JITTER_FACTOR = 200;

export function getRandomizedPosition(
  position: [number, number],
  rng: RNG,
): [number, number] {
  const xOffset = rng.getInt(-JITTER_FACTOR, JITTER_FACTOR) / 1000;
  const yOffset = rng.getInt(-JITTER_FACTOR, JITTER_FACTOR) / 1000;

  const x = position[0] + xOffset;
  const y = position[1] + yOffset;

  return [x, y];
}
