import { createId } from '@paralleldrive/cuid2';
import type { AvatarData } from '../types';
import { EquipmentSlot } from '../types';

export function createMockAvatarData(
  overrides: Partial<AvatarData> = {},
): AvatarData {
  const avatar: AvatarData = {
    id: createId(),
    image: '/assets/images/avatar-placeholder.png',
    level: 1,
    life: 200,
    name: 'Test Avatar',
    ...overrides,
    paperdoll: {
      [EquipmentSlot.MainHand]: {
        id: createId(),
        maxDamage: 20,
        minDamage: 10,
        name: 'Bloodthirst Blade, Bastard Sword',
        // weapon has a speed of 0.8 attacks per second === 1.25s interval
        speed: 0.8,
      },
      ...overrides.paperdoll,
    },
  };

  return avatar;
}
