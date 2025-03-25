import { expect, test } from 'vitest';
import invariant from 'tiny-invariant';
import type { EnemyAttackEvent } from '~/types';
import { createCharacter } from '~/entities/create-character';
import { createMockActivityData } from '~/test-utils/create-mock-activity-data';
import { createMockCharacterData } from '~/test-utils/create-mock-character-data';
import { createMockEnemyData } from '~/test-utils/create-mock-enemy-data';
import { createMockSimulationContext } from '~/test-utils/create-mock-simulation-context';
import { CombatEventType } from '~/types';
import { createActivity } from './create-activity';
import { handleEnemyAttack } from './handle-enemy-attack';

test('it applies damage from the enemy to the character', () => {
  const enemyData = createMockEnemyData({
    life: 100,
    primaryAttack: {
      maxDamage: 10,
      minDamage: 10,
      speed: 1,
    },
  });

  const characterData = createMockCharacterData({ life: 100 });

  const activityData = createMockActivityData({
    enemies: [enemyData],
  });

  const ctx = createMockSimulationContext();
  const character = createCharacter(characterData, ctx);
  const activity = createActivity(activityData, ctx, {
    groupCount: 1,
    groupSize: 1,
  });

  const enemy = activity.currentEnemyGroup.nextLivingEnemy;

  invariant(enemy, 'enemy is required');

  const event: EnemyAttackEvent = {
    id: 'event-1',
    source: enemy.id,
    time: 100,
    type: CombatEventType.EnemyAttack,
  };

  handleEnemyAttack(event, character, activity);

  expect(character.life).toBe(90);
});

test('it does nothing if the enemy is dead', () => {
  const enemyData = createMockEnemyData({
    life: 100,
    primaryAttack: {
      maxDamage: 10,
      minDamage: 10,
      speed: 1,
    },
  });

  const characterData = createMockCharacterData({ life: 100 });

  const activityData = createMockActivityData({
    enemies: [enemyData],
  });

  const ctx = createMockSimulationContext();
  const character = createCharacter(characterData, ctx);
  const activity = createActivity(activityData, ctx, {
    groupCount: 1,
    groupSize: 1,
  });

  const enemy = activity.currentEnemyGroup.nextLivingEnemy;

  invariant(enemy, 'enemy is required');

  // kill the enemy
  activity.currentEnemyGroup.nextLivingEnemy.receiveDamage(100);

  const event: EnemyAttackEvent = {
    id: 'event-1',
    source: enemy.id,
    time: 100,
    type: CombatEventType.EnemyAttack,
  };

  handleEnemyAttack(event, character, activity);

  expect(character.life).toBe(100);
});

// this covers a regression where we weren't correctly filtering our enemies
// by the event source and were applying damage for dead enemies by using
// the next living enemy
test('it correctly resolves the correct event source', () => {
  const enemyData = createMockEnemyData({
    life: 100,
    primaryAttack: {
      maxDamage: 10,
      minDamage: 10,
      speed: 1,
    },
  });

  const characterData = createMockCharacterData({ life: 100 });

  const activityData = createMockActivityData({
    enemies: [enemyData],
  });

  const ctx = createMockSimulationContext();
  const character = createCharacter(characterData, ctx);
  const activity = createActivity(activityData, ctx, {
    groupCount: 1,
    // it's important we have more than 1 enemy so we can ensure event source
    // resolution works
    groupSize: 2,
  });

  const firstEnemy = activity.currentEnemyGroup.nextLivingEnemy;

  invariant(firstEnemy, 'enemy is required');

  const event: EnemyAttackEvent = {
    id: 'event-1',
    source: firstEnemy.id,
    time: 100,
    type: CombatEventType.EnemyAttack,
  };

  // kill the enemy
  firstEnemy.receiveDamage(100);

  handleEnemyAttack(event, character, activity);

  expect(character.life).toBe(100);
});
