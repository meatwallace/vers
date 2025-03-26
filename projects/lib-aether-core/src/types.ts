export interface SerializableAetherNode {
  c: [null | string, null | string, null | string, null | string];
  d: number;
  i: string;
  p: [number, number];
  s: number;
}

export interface AetherNode {
  connections: [
    AetherNode | null,
    AetherNode | null,
    AetherNode | null,
    AetherNode | null,
  ];
  difficulty: number;
  id: string;
  index: number;
  position: [number, number];
  seed: number;
}

export type SerializableAetherGraph = Array<SerializableAetherNode>;

export type AetherGraph = Array<AetherNode>;
