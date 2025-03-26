import { AetherGraph, SerializableAetherGraph } from './types';

/**
 * converts an AetherGraph into a SerializableAetherGraph
 *
 * @param graph - The AetherGraph to serialize.
 * @returns A SerializableAetherGraph.
 */
export function getSerializableAetherGraph(
  graph: AetherGraph,
): SerializableAetherGraph {
  return graph.map((node) => ({
    c: node.connections.map((c) => c?.id) as [string, string, string, string],
    d: node.difficulty,
    i: node.id.slice(0, 8),
    p: node.position,
    s: node.seed,
  }));
}
