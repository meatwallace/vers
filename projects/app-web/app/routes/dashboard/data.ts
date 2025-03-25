import type { ActivityData, CharacterData } from '@vers/idle-core';
import {
  ActivityFailureAction,
  ActivityType,
  EquipmentSlot,
} from '@vers/idle-core';

export const activityData: ActivityData = {
  enemies: [
    {
      level: 1,
      life: 30,
      name: 'Test Enemy',
      primaryAttack: {
        maxDamage: 3,
        minDamage: 1,
        speed: 0.5,
      },
    },
  ],
  failureAction: ActivityFailureAction.Retry,
  id: 'aether_node_1',
  name: 'Aether Node',
  type: ActivityType.AetherNode,
};

export const initialSeed = Date.now() ^ (Math.random() * 0x100000000);

export const characterData: CharacterData = {
  id: '1',
  level: 1,
  life: 200,
  name: 'Test Character',
  paperdoll: {
    [EquipmentSlot.MainHand]: {
      id: '1',
      maxDamage: 20,
      minDamage: 10,
      name: 'Bloodthirst Blade, Bastard Sword',
      speed: 0.8,
    },
  },
};
