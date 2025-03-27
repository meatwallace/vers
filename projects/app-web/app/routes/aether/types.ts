import type { AetherNode } from '@vers/aether-core';

export interface AetherGraph {
  edges: AetherEdgeMap;
  nodes: AetherNodeMap;
}

export type AetherEdgeMap = Record<string, AetherEdge>;

export type AetherNodeMap = Record<string, AetherNode>;

export interface AetherEdge {
  end: [number, number];
  id: string;
  start: [number, number];
}

export type VectorTuple = [number, number, number];
