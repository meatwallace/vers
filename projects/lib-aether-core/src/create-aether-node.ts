import { init } from '@paralleldrive/cuid2';
import { getNodePosition } from './get-node-position';
import { AetherNode } from './types';

function getSeed() {
  // return Date.now() ^ (Math.random() * 0x100000000);
  return Date.now() ^ (Math.random() * 0x10000000);
}

const createId = init({ length: 6 });

export function createAetherNode(
  index: number,
  difficulty: number,
): AetherNode {
  return {
    connections: [null, null, null, null],
    difficulty,
    id: createId(),
    index,
    position: getNodePosition(index, difficulty),
    seed: getSeed(),
  };
}
