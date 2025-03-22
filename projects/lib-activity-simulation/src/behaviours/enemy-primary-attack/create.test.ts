import { expect, test } from 'vitest';
import { createEnemy } from '~/entities/create-enemy';
import { createMockEnemyData } from '~/test-utils/create-mock-enemy-data';
import { createMockSimulationContext } from '~/test-utils/create-mock-simulation-context';
import { LifecycleEvent } from '~/types';
import { create } from './create';

test('it creates a behaviour with the correct values', () => {
  const enemyData = createMockEnemyData({
    primaryAttack: {
      maxDamage: 10,
      minDamage: 10,
      speed: 1,
    },
  });

  const ctx = createMockSimulationContext();
  const enemy = createEnemy(enemyData, ctx);
  const behaviour = create(enemy);

  expect(behaviour.lastAttackTime).toBe(0);
  expect(behaviour.nextAttackTime).toBe(1000);
});

test('it handles the reset event', () => {
  const enemyData = createMockEnemyData({
    primaryAttack: {
      maxDamage: 10,
      minDamage: 10,
      speed: 1,
    },
  });

  const ctx = createMockSimulationContext();
  const enemy = createEnemy(enemyData, ctx);
  const behaviour = create(enemy);

  behaviour.setState((draft) => {
    draft.lastAttackTime = 2000;
  });

  behaviour.handlers[LifecycleEvent.Reset]?.(enemy, ctx);

  expect(behaviour.state).toStrictEqual({
    lastAttackTime: 0,
  });
});
