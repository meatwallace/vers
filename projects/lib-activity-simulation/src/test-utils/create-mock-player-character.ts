import { createId } from '@paralleldrive/cuid2';
import type { PlayerCharacterData } from '~/types';
import { EquipmentSlot } from '~/types';

export function createMockPlayerCharacterData(): PlayerCharacterData {
  const character = {
    id: createId(),
    level: 1,
    life: 200,
    paperdoll: {
      [EquipmentSlot.TwoHandedWeapon]: {
        id: createId(),
        maxDamage: 20,
        minDamage: 10,
        name: 'Bloodthirst Blade, Bastard Sword',
        // weapon has a speed of 0.8 attacks per second === 1.25s interval
        speed: 0.8,
      },
    },
  } satisfies PlayerCharacterData;

  return character;
}
