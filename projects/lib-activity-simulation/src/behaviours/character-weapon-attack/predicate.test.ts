import { expect, test } from 'vitest';
import { createCharacter } from '~/entities/create-character';
import { createMockCharacterData } from '~/test-utils/create-mock-character-data';
import { createMockSimulationContext } from '~/test-utils/create-mock-simulation-context';
import { EquipmentSlot } from '~/types';
import { predicate } from './predicate';

test('it returns true when character has a main hand weapon', () => {
  const characterData = createMockCharacterData({
    paperdoll: {
      [EquipmentSlot.MainHand]: {
        id: 'test-weapon',
        maxDamage: 10,
        minDamage: 5,
        name: 'Test Weapon',
        speed: 1,
      },
    },
  });

  const ctx = createMockSimulationContext();
  const character = createCharacter(characterData, ctx);

  const result = predicate(character);

  expect(result).toBeTrue();
});

test('it returns false when character has no main hand weapon', () => {
  const characterData = createMockCharacterData({
    paperdoll: {
      [EquipmentSlot.MainHand]: null,
    },
  });

  const ctx = createMockSimulationContext();
  const character = createCharacter(characterData, ctx);

  const result = predicate(character);

  expect(result).toBeFalse();
});
