import { expect, test } from 'vitest';
import { createCharacter } from '~/entities/create-character';
import { createMockCharacterData } from '~/test-utils/create-mock-character-data';
import { createMockSimulationContext } from '~/test-utils/create-mock-simulation-context';
import { EquipmentSlot } from '~/types';
import { getNextAttackTime } from './get-next-attack-time';

test('it calculates the next attack time', () => {
  const characterData = createMockCharacterData({
    paperdoll: {
      [EquipmentSlot.MainHand]: {
        id: 'test-weapon',
        maxDamage: 10,
        minDamage: 5,
        name: 'Test Weapon',
        speed: 1, // 1 attack per second = 1000ms interval
      },
    },
  });

  const ctx = createMockSimulationContext();
  const character = createCharacter(characterData, ctx);

  const state = { lastAttackTime: 1000 };

  const nextAttackTime = getNextAttackTime(character, state);

  expect(nextAttackTime).toBe(2000); // 1000 + 1000
});
