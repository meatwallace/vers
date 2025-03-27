import type { CompressedAetherNode } from '@vers/aether-core';
import type { RNG } from '@vers/idle-core';

const JITTER_FACTOR = 200;

export function getRandomizedPosition(
  node: CompressedAetherNode,
  rng: RNG,
): [number, number] {
  const xOffset = rng.getInt(-JITTER_FACTOR, JITTER_FACTOR) / 1000;
  const yOffset = rng.getInt(-JITTER_FACTOR, JITTER_FACTOR) / 1000;

  const x = node.p[0] + xOffset;
  const y = node.p[1] + yOffset;

  return [x, y];
}
