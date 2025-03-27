import type { AetherEdgeMap, AetherNodeMap } from './types';
import { useAetherGraphStore } from './use-aether-graph-store';

export function setAetherGraph(nodes: AetherNodeMap, edges: AetherEdgeMap) {
  useAetherGraphStore.setState({ edges, nodes });
}
