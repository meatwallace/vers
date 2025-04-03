import { expect, test } from 'vitest';
import { EquipmentSlot } from '../types';
import { createMockAvatarData } from './create-mock-avatar-data';

test('it creates avatar data with expected properties', () => {
  const avatar = createMockAvatarData();

  expect(avatar).toStrictEqual({
    id: expect.any(String),
    image: '/assets/images/avatar-placeholder.png',
    level: 1,
    life: 200,
    name: 'Test Avatar',
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

test('it creates avatar data with custom properties', () => {
  const avatar = createMockAvatarData({
    id: 'test-id',
    image: '/assets/images/avatar-placeholder-2.png',
    level: 2,
    life: 100,
    name: 'Test Avatar 2',
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

  expect(avatar).toStrictEqual({
    id: 'test-id',
    image: '/assets/images/avatar-placeholder-2.png',
    level: 2,
    life: 100,
    name: 'Test Avatar 2',
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
