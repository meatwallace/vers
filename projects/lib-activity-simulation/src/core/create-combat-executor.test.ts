import { expect, test } from 'vitest';
import type { EquipmentWeapon } from '~/types';
import { createCharacter } from '~/entities/create-character';
import { createMockActivityData } from '~/test-utils/create-mock-activity-data';
import { createMockCharacterData } from '~/test-utils/create-mock-character-data';
import { createMockEnemyData } from '~/test-utils/create-mock-enemy-data';
import { createMockSimulationContext } from '~/test-utils/create-mock-simulation-context';
import { EquipmentSlot } from '~/types';
import { createActivity } from './create-activity';
import { createCombatExecutor } from './create-combat-executor';

test('it processes events', () => {
  const weapon: EquipmentWeapon = {
    id: 'test-weapon',
    maxDamage: 100,
    minDamage: 100,
    name: 'Test Weapon',
    speed: 1,
  };

  const characterData = createMockCharacterData({
    life: 100,
    paperdoll: {
      [EquipmentSlot.MainHand]: weapon,
    },
  });

  const enemyData = createMockEnemyData({
    life: 100,
    primaryAttack: {
      maxDamage: 40,
      minDamage: 40,
      speed: 1,
    },
  });

  const activityData = createMockActivityData({
    enemies: [enemyData],
  });

  const ctx = createMockSimulationContext();
  const character = createCharacter(characterData, ctx);
  const activity = createActivity(activityData, ctx, {
    groupCount: 1,
    groupSize: 2,
  });

  const enemyGroup = activity.currentEnemyGroup;

  const combatExecutor = createCombatExecutor(activity, character, ctx);

  // run the combat for 1s so that all entities should attack once
  combatExecutor.run(1000);

  // in this contrived example, the character should kill one enemy and be left with one enemy
  // and have received one enemy worth of damage
  expect(enemyGroup.remaining).toBe(1);
  expect(character.life).toBe(60);
});
