import { expect, test } from 'vitest';
import { createActivity } from '~/core/create-activity';
import { createCombatExecutor } from '~/core/create-combat-executor';
import { createCharacter } from '~/entities/create-character';
import { createMockActivityData } from '~/test-utils/create-mock-activity-data';
import { createMockCharacterData } from '~/test-utils/create-mock-character-data';
import { createMockSimulationContext } from '~/test-utils/create-mock-simulation-context';
import { EquipmentSlot } from '~/types';
import { isAttackReady } from './is-attack-ready';

test('it returns true when elapsed time is equal or greater than the next attack time', () => {
  const characterData = createMockCharacterData({
    paperdoll: {
      [EquipmentSlot.MainHand]: {
        id: 'test-weapon',
        maxDamage: 10,
        minDamage: 5,
        name: 'Test Weapon',
        speed: 1, // 1000ms interval
      },
    },
  });

  const ctx = createMockSimulationContext();
  const activityData = createMockActivityData();
  const activity = createActivity(activityData, ctx);
  const character = createCharacter(characterData, ctx);
  const executor = createCombatExecutor(activity, character, ctx);

  const state = { lastAttackTime: 0 };

  executor.run(1000);

  expect(isAttackReady(character, state, executor)).toBeTrue();

  executor.run(1);

  expect(isAttackReady(character, state, executor)).toBeTrue();
});

test('it returns false when elapsed time is less than the next attack time', () => {
  const characterData = createMockCharacterData({
    paperdoll: {
      [EquipmentSlot.MainHand]: {
        id: 'test-weapon',
        maxDamage: 10,
        minDamage: 5,
        name: 'Test Weapon',
        speed: 1, // 1000ms interval
      },
    },
  });

  const ctx = createMockSimulationContext();
  const activityData = createMockActivityData();
  const activity = createActivity(activityData, ctx);
  const character = createCharacter(characterData, ctx);
  const executor = createCombatExecutor(activity, character, ctx);

  const state = { lastAttackTime: 0 };

  executor.run(999);

  expect(isAttackReady(character, state, executor)).toBeFalse();
});

test('it uses the last attacked time to calculate the next attack time', () => {
  const characterData = createMockCharacterData({
    paperdoll: {
      [EquipmentSlot.MainHand]: {
        id: 'test-weapon',
        maxDamage: 10,
        minDamage: 5,
        name: 'Test Weapon',
        speed: 1, // 1000ms interval
      },
    },
  });

  const ctx = createMockSimulationContext();
  const activityData = createMockActivityData();
  const activity = createActivity(activityData, ctx);
  const character = createCharacter(characterData, ctx);
  const executor = createCombatExecutor(activity, character, ctx);

  const state = { lastAttackTime: 999 };

  expect(isAttackReady(character, state, executor)).toBeFalse();

  executor.run(1000);

  expect(isAttackReady(character, state, executor)).toBeFalse();

  executor.run(1000);

  expect(isAttackReady(character, state, executor)).toBeTrue();
});
