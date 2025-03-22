import type { Character, CombatEvent } from '~/types';

// returns a fn that sorts events by time then by event source,
// preferring the character's events first
export function createEventSorter(character: Character) {
  return (a: CombatEvent, b: CombatEvent) => {
    const timeDiff = a.time - b.time;

    if (timeDiff === 0) {
      return a.source === character.id ? -1 : 1;
    }

    return timeDiff;
  };
}
