import { expect, test } from 'vitest';
import type { CharacterAttackEvent, EquipmentWeapon } from '~/types';
import { createCharacter } from '~/entities/create-character';
import { createMockActivityData } from '~/test-utils/create-mock-activity-data';
import { createMockCharacterData } from '~/test-utils/create-mock-character-data';
import { createMockEnemyData } from '~/test-utils/create-mock-enemy-data';
import { createMockSimulationContext } from '~/test-utils/create-mock-simulation-context';
import { CombatEventType, EquipmentSlot } from '~/types';
import { createActivity } from './create-activity';
import { handleCharacterAttack } from './handle-character-attack';

test('it applies damage to the first living enemy', () => {
  const weapon: EquipmentWeapon = {
    id: 'test-weapon',
    maxDamage: 10,
    minDamage: 10,
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
  const firstEnemy = enemyGroup.nextLivingEnemy;

  // kill the first enemy
  firstEnemy?.receiveDamage(100);

  const event: CharacterAttackEvent = {
    id: 'event-1',
    source: character.id,
    time: 100,
    type: CombatEventType.CharacterAttack,
  };

  handleCharacterAttack(event, character, activity);

  // verify second enemy's life
  expect(enemyGroup.nextLivingEnemy?.life).toBe(90);
});
