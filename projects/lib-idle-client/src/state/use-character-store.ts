import type { CharacterAppState } from '@vers/idle-core';
import { create } from 'zustand';

interface CharacterStore {
  character: CharacterAppState | null;
}

export const useCharacterStore = create<CharacterStore>()(() => ({
  character: null,
}));
