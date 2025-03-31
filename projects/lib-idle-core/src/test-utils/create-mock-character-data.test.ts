import { expect, test } from 'vitest';
import { EquipmentSlot } from '../types';
import { createMockCharacterData } from './create-mock-character-data';

test('it creates character data with expected properties', () => {
  const character = createMockCharacterData();

  expect(character).toStrictEqual({
    id: expect.any(String),
    image: '/assets/images/character-placeholder.png',
    level: 1,
    life: 200,
    name: 'Test Character',
    paperdoll: {
      [EquipmentSlot.MainHand]: {
        id: expect.any(String),
        maxDamage: 20,
        minDamage: 10,
        name: 'Bloodthirst Blade, Bastard Sword',
        speed: 0.8,
      },
    },
  });
});

test('it creates character data with custom properties', () => {
  const character = createMockCharacterData({
    id: 'test-id',
    image: '/assets/images/character-placeholder-2.png',
    level: 2,
    life: 100,
    name: 'Test Character 2',
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

  expect(character).toStrictEqual({
    id: 'test-id',
    image: '/assets/images/character-placeholder-2.png',
    level: 2,
    life: 100,
    name: 'Test Character 2',
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
});
