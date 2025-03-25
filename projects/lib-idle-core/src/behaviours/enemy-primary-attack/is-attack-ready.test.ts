import { expect, test } from 'vitest';
import invariant from 'tiny-invariant';
import { createActivity } from '../../core/create-activity';
import { createCombatExecutor } from '../../core/create-combat-executor';
import { createCharacter } from '../../entities/create-character';
import { createMockActivityData } from '../../test-utils/create-mock-activity-data';
import { createMockCharacterData } from '../../test-utils/create-mock-character-data';
import { createMockEnemyData } from '../../test-utils/create-mock-enemy-data';
import { createMockSimulationContext } from '../../test-utils/create-mock-simulation-context';
import { isAttackReady } from './is-attack-ready';

test('it returns true when elapsed time is equal or greater than the next attack time', () => {
  const characterData = createMockCharacterData();
  const enemyData = createMockEnemyData({
    primaryAttack: {
      maxDamage: 10,
      minDamage: 5,
      speed: 1, // 1000ms interval
    },
  });

  const activityData = createMockActivityData({ enemies: [enemyData] });

  const ctx = createMockSimulationContext();
  const character = createCharacter(characterData, ctx);
  const activity = createActivity(activityData, ctx, { groupSize: 1 });
  const executor = createCombatExecutor(activity, character, ctx);

  const enemy = activity.currentEnemyGroup?.enemies[0];

  invariant(enemy, 'enemy group is required');

  const state = { lastAttackTime: 0 };

  executor.run(1000);

  expect(isAttackReady(enemy, state, executor)).toBeTrue();

  executor.run(1);

  expect(isAttackReady(enemy, state, executor)).toBeTrue();
});

test('it returns false when elapsed time is less than next attack time', () => {
  const characterData = createMockCharacterData();
  const enemyData = createMockEnemyData({
    primaryAttack: {
      maxDamage: 10,
      minDamage: 5,
      speed: 1, // 1000ms interval
    },
  });

  const activityData = createMockActivityData({ enemies: [enemyData] });

  const ctx = createMockSimulationContext();
  const character = createCharacter(characterData, ctx);
  const activity = createActivity(activityData, ctx, { groupSize: 1 });
  const executor = createCombatExecutor(activity, character, ctx);

  const enemy = activity.currentEnemyGroup?.enemies[0];

  invariant(enemy, 'enemy group is required');

  const state = { lastAttackTime: 0 };

  expect(isAttackReady(enemy, state, executor)).toBeFalse();
});

test('it uses the last attacked time to calculate the next attack time', () => {
  const characterData = createMockCharacterData();
  const enemyData = createMockEnemyData({
    primaryAttack: {
      maxDamage: 10,
      minDamage: 5,
      speed: 1, // 1000ms interval
    },
  });

  const activityData = createMockActivityData({ enemies: [enemyData] });

  const ctx = createMockSimulationContext();
  const character = createCharacter(characterData, ctx);
  const activity = createActivity(activityData, ctx, { groupSize: 1 });
  const executor = createCombatExecutor(activity, character, ctx);

  const enemy = activity.currentEnemyGroup?.enemies[0];

  invariant(enemy, 'enemy group is required');

  const state = { lastAttackTime: 999 };

  expect(isAttackReady(enemy, state, executor)).toBeFalse();

  executor.run(1000);

  expect(isAttackReady(enemy, state, executor)).toBeFalse();

  executor.run(1000);

  expect(isAttackReady(enemy, state, executor)).toBeTrue();
});

test('it returns false when the enemy is dead', () => {
  const characterData = createMockCharacterData();
  const enemyData = createMockEnemyData({
    life: 1,
    primaryAttack: {
      maxDamage: 10,
      minDamage: 5,
      speed: 1, // 1000ms interval
    },
  });

  const activityData = createMockActivityData({ enemies: [enemyData] });

  const ctx = createMockSimulationContext();
  const character = createCharacter(characterData, ctx);
  const activity = createActivity(activityData, ctx, { groupSize: 1 });
  const executor = createCombatExecutor(activity, character, ctx);

  const enemy = activity.currentEnemyGroup?.enemies[0];

  invariant(enemy, 'enemy group is required');

  enemy.receiveDamage(100);

  const state = { lastAttackTime: 0 };

  expect(isAttackReady(enemy, state, executor)).toBeFalse();
});
