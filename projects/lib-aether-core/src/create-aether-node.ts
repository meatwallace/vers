import type { AetherNode } from './types';
import { createID } from './create-id';
import { getNodePosition } from './get-node-position';
import { getSeed } from './get-seed';

export function createAetherNode(
  index: number,
  difficulty: number,
): AetherNode {
  return {
    connections: [null, null, null, null],
    difficulty,
    id: createID(),
    index,
    position: getNodePosition(index, difficulty),
    seed: getSeed(),
  };
}
