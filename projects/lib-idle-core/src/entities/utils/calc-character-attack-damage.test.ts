import { expect, test } from 'vitest';
import { createMockCharacterData } from '../../test-utils/create-mock-character-data';
import { createMockSimulationContext } from '../../test-utils/create-mock-simulation-context';
import { EquipmentSlot } from '../../types';
import { createCharacter } from '../create-character';
import { calcCharacterAttackDamage } from './calc-character-attack-damage';

test('it calculates the damage for a character attack', () => {
  const characterData = createMockCharacterData({
    paperdoll: {
      [EquipmentSlot.MainHand]: {
        id: 'test-weapon',
        maxDamage: 10,
        minDamage: 10,
        name: 'Test Weapon',
        speed: 1,
      },
    },
  });

  const ctx = createMockSimulationContext();
  const character = createCharacter(characterData, ctx);

  const damage = calcCharacterAttackDamage(character, ctx);

  expect(damage).toBe(10);
});
