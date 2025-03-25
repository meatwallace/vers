import { expect, test } from 'vitest';
import { createActivity } from '../../core/create-activity';
import { createCombatExecutor } from '../../core/create-combat-executor';
import { createCharacter } from '../../entities/create-character';
import { createMockActivityData } from '../../test-utils/create-mock-activity-data';
import { createMockCharacterData } from '../../test-utils/create-mock-character-data';
import { createMockEnemyData } from '../../test-utils/create-mock-enemy-data';
import { createMockSimulationContext } from '../../test-utils/create-mock-simulation-context';
import { BehaviourID, EntityStatus } from '../../types';
import { create } from './create';
import { handleTick } from './handle-tick';

test('it schedules attacks on the tick event', () => {
  const enemyData = createMockEnemyData({
    life: 9999,
    primaryAttack: {
      maxDamage: 10,
      minDamage: 10,
      speed: 1, // 1000ms interval
    },
  });

  const characterData = createMockCharacterData({ life: 10 });
  const activityData = createMockActivityData({ enemies: [enemyData] });

  const ctx = createMockSimulationContext();
  const activity = createActivity(activityData, ctx, { groupSize: 1 });
  const character = createCharacter(characterData, ctx);
  const enemyGroup = activity.currentEnemyGroup;
  const combatExecutor = createCombatExecutor(activity, character, ctx);

  const enemy = enemyGroup!.enemies[0]!;
  const behaviour = create(enemy);

  // we need to remove the behaviour from the enemy as it's already added
  // by default and would get ran when we run our combat executor
  enemy.removeBehaviour(BehaviourID.EnemyPrimaryAttack);

  combatExecutor.run(1000);

  handleTick(enemy, behaviour, combatExecutor);

  expect(character.status).toBe(EntityStatus.Alive);

  combatExecutor.run(1);

  handleTick(enemy, behaviour, combatExecutor);

  expect(character.status).toBe(EntityStatus.Dead);
  expect(behaviour.state.lastAttackTime).toBe(1000);
});

test('it schedules multiple attacks for high APS weapons', () => {
  const enemyData = createMockEnemyData({
    life: 9999,
    primaryAttack: {
      maxDamage: 10,
      minDamage: 10,
      speed: 2, // 500ms interval
    },
  });

  const characterData = createMockCharacterData({ life: 50 });
  const activityData = createMockActivityData({ enemies: [enemyData] });

  const ctx = createMockSimulationContext();
  const activity = createActivity(activityData, ctx, { groupSize: 1 });
  const character = createCharacter(characterData, ctx);
  const enemyGroup = activity.currentEnemyGroup;
  const combatExecutor = createCombatExecutor(activity, character, ctx);

  const enemy = enemyGroup!.enemies[0]!;
  const behaviour = create(enemy);
  // we need to remove the behaviour from the enemy as it's already added
  // by default and would get ran when we run our combat executor
  enemy.removeBehaviour(BehaviourID.EnemyPrimaryAttack);

  combatExecutor.run(2500);

  handleTick(enemy, behaviour, combatExecutor);

  combatExecutor.run(1);

  expect(character.status).toBe(EntityStatus.Dead);
  expect(behaviour.state.lastAttackTime).toBe(2500);
});
