import { expect, test } from 'vitest';
import { createActivity } from '../../core/create-activity';
import { createCombatExecutor } from '../../core/create-combat-executor';
import { createCharacter } from '../../entities/create-character';
import { createMockActivityData } from '../../test-utils/create-mock-activity-data';
import { createMockCharacterData } from '../../test-utils/create-mock-character-data';
import { createMockEnemyData } from '../../test-utils/create-mock-enemy-data';
import { createMockSimulationContext } from '../../test-utils/create-mock-simulation-context';
import { BehaviourID, EquipmentSlot } from '../../types';
import { create } from './create';
import { handleTick } from './handle-tick';

test('it schedules attacks on the tick event', () => {
  const characterData = createMockCharacterData({
    paperdoll: {
      [EquipmentSlot.MainHand]: {
        id: 'test-weapon',
        maxDamage: 10,
        minDamage: 10,
        name: 'Test Weapon',
        speed: 1, // 1000ms interval
      },
    },
  });

  const enemyData = createMockEnemyData({ life: 10 });
  const activityData = createMockActivityData({ enemies: [enemyData] });
  const ctx = createMockSimulationContext();
  const activity = createActivity(activityData, ctx, { groupSize: 1 });
  const character = createCharacter(characterData, ctx);
  const combatExecutor = createCombatExecutor(activity, character, ctx);

  const enemyGroup = activity.currentEnemyGroup;

  // we need to remove the behaviour from the character as it's already added
  // by default and would get ran when we run our combat executor
  character.removeBehaviour(BehaviourID.PlayerWeaponAttack);

  const behaviour = create(character);

  combatExecutor.run(1000);

  handleTick(character, behaviour, combatExecutor);

  expect(enemyGroup?.remaining).toBe(1);

  combatExecutor.run(1);

  handleTick(character, behaviour, combatExecutor);

  expect(enemyGroup?.remaining).toBe(0);
  expect(behaviour.state.lastAttackTime).toBe(1000);
});

test('it schedules multiple attacks for high APS weapons', () => {
  const characterData = createMockCharacterData({
    paperdoll: {
      [EquipmentSlot.MainHand]: {
        id: 'test-weapon',
        maxDamage: 10,
        minDamage: 10,
        name: 'Test Weapon',
        speed: 2, // 500ms interval
      },
    },
  });

  const enemyData = createMockEnemyData({ life: 10 });
  const activityData = createMockActivityData({ enemies: [enemyData] });
  const ctx = createMockSimulationContext();
  const activity = createActivity(activityData, ctx, { groupSize: 5 });
  const character = createCharacter(characterData, ctx);
  const combatExecutor = createCombatExecutor(activity, character, ctx);

  const enemyGroup = activity.currentEnemyGroup;

  // we need to remove the behaviour from the character as it's already added
  // by default and would get ran when we run our combat executor
  character.removeBehaviour(BehaviourID.PlayerWeaponAttack);

  const behaviour = create(character);

  combatExecutor.run(2500);

  handleTick(character, behaviour, combatExecutor);

  combatExecutor.run(1);

  expect(enemyGroup?.remaining).toBe(0);
  expect(behaviour.state.lastAttackTime).toBe(2500);
});
