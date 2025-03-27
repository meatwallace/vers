import type { AetherNode, CompressedAetherGraphData } from '@vers/aether-core';
import { createRNG } from '@vers/idle-core';
import type { AetherNodeMap } from './types';
import { getRandomizedPosition } from './get-randomized-position';

export function getAetherNodeMap(
  compressedNodes: CompressedAetherGraphData,
): AetherNodeMap {
  const nodes: AetherNodeMap = {};

  for (const node of compressedNodes) {
    const rng = createRNG(node.s);

    const aetherNode: AetherNode = {
      connections: node.c,
      difficulty: node.d,
      id: node.id,
      index: node.i,
      position: getRandomizedPosition(node, rng),
      seed: node.s,
    };

    nodes[node.id] = aetherNode;
  }

  return nodes;
}
