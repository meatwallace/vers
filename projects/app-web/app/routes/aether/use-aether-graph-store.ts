import { create } from 'zustand';
import type { AetherGraph } from './types';

export const useAetherGraphStore = create<AetherGraph>(() => ({
  edges: {},
  nodes: {},
}));
