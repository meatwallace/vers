import type { CharacterAppState } from '@vers/idle-core';
import { useCharacterStore } from './use-character-store';

export function setCharacter(character: CharacterAppState) {
  useCharacterStore.setState(() => ({ character }));
}
