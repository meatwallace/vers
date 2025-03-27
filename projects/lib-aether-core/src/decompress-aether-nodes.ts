import type { AetherGraph, CompressedAetherNode } from './types';
import { getAetherEdgeMap } from './get-aether-edge-map';
import { getAetherNodeMap } from './get-aether-node-map';

export function decompressAetherNodes(
  data: Array<CompressedAetherNode>,
): AetherGraph {
  const nodes = getAetherNodeMap(data);

  return {
    edges: getAetherEdgeMap(nodes),
    nodes,
  };
}
