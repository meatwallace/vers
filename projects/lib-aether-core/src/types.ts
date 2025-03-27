export interface AetherGraph {
  edges: AetherEdgeMap;
  nodes: AetherNodeMap;
}

export type AetherEdgeMap = Record<string, AetherEdge>;

export type AetherNodeMap = Record<string, AetherNode>;

export interface AetherNode {
  connections: [null | string, null | string, null | string, null | string];
  difficulty: number;
  id: string;
  index: number;
  position: [number, number];
  seed: number;
}

export interface AetherEdge {
  end: [number, number];
  id: string;
  start: [number, number];
}

export interface CompressedAetherNode {
  c: [null | string, null | string, null | string, null | string];
  d: number;
  i: number;
  id: string;
  p: [number, number];
  s: number;
}
