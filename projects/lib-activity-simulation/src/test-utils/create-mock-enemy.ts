import type { EnemyData } from '~/types';

export function createMockEnemyData(): EnemyData {
  const enemy = {
    level: 1,
    life: 30,
    primaryAttack: {
      maxDamage: 3,
      minDamage: 1,
      speed: 0.5,
    },
  } satisfies EnemyData;

  return enemy;
}
