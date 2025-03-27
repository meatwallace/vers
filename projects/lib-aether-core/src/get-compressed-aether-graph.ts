import { AetherGraph, CompressedAetherGraphData } from './types';

/**
 * converts an AetherGraph into a SerializableAetherGraph
 *
 * @param graph - The AetherGraph to serialize.
 * @returns A SerializableAetherGraph.
 */
export function getCompressedAetherGraph(
  graph: AetherGraph,
): CompressedAetherGraphData {
  return graph.map((node) => ({
    c: node.connections,
    d: node.difficulty,
    i: node.index,
    id: node.id,
    p: node.position,
    s: node.seed,
  }));
}
