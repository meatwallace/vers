import { expect, test } from 'vitest';
import { createCharacter } from '../../entities/create-character';
import { createMockCharacterData } from '../../test-utils/create-mock-character-data';
import { createMockSimulationContext } from '../../test-utils/create-mock-simulation-context';
import { EquipmentSlot } from '../../types';
import { getAttackIntervalMS } from './get-attack-interval-ms';

test('it calculates the weapons attack interval', () => {
  const characterData = createMockCharacterData({
    paperdoll: {
      [EquipmentSlot.MainHand]: {
        id: 'test-weapon',
        maxDamage: 10,
        minDamage: 5,
        name: 'Slow Weapon',
        speed: 0.55,
      },
    },
  });

  const ctx = createMockSimulationContext();
  const character = createCharacter(characterData, ctx);

  const interval = getAttackIntervalMS(character);

  expect(interval).toBe(1818); // 1000ms / 0.55 = 1818ms
});
