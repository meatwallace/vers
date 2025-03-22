import { createId } from '@paralleldrive/cuid2';
import type { Character, CharacterAttackEvent } from '~/types';
import { CombatEventType } from '~/types';

export function createCharacterAttackEvent(
  entity: Character,
  time: number,
): CharacterAttackEvent {
  const event: CharacterAttackEvent = {
    id: createId(),
    source: entity.id,
    time,
    type: CombatEventType.CharacterAttack,
  };

  return event;
}
