export interface AetherNode {
  connections: [null | string, null | string, null | string, null | string];
  difficulty: number;
  id: string;
  index: number;
  position: [number, number];
  seed: number;
}

export type AetherGraph = Array<AetherNode>;

export interface CompressedAetherNode {
  c: [null | string, null | string, null | string, null | string];
  d: number;
  i: number;
  id: string;
  p: [number, number];
  s: number;
}

export type CompressedAetherGraphData = Array<CompressedAetherNode>;
