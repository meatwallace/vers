import { useShallow } from 'zustand/react/shallow';
import { useCharacterStore } from './use-character-store';

export function useCharacter() {
  const character = useCharacterStore(useShallow((state) => state.character));

  return character;
}
