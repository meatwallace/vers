import { expect, test } from 'vitest';
import { createMockEnemyData } from './create-mock-enemy-data';

test('it creates enemy data with expected properties', () => {
  const enemy = createMockEnemyData();

  expect(enemy).toStrictEqual({
    level: 1,
    life: 30,
    name: 'Test Enemy',
    primaryAttack: {
      maxDamage: 3,
      minDamage: 1,
      speed: 0.5,
    },
  });
});

test('it creates enemy data with custom properties', () => {
  const enemy = createMockEnemyData({
    level: 2,
    life: 100,
    name: 'Custom Enemy',
    primaryAttack: {
      maxDamage: 10,
      minDamage: 5,
      speed: 1,
    },
  });

  expect(enemy).toStrictEqual({
    level: 2,
    life: 100,
    name: 'Custom Enemy',
    primaryAttack: {
      maxDamage: 10,
      minDamage: 5,
      speed: 1,
    },
  });
});
