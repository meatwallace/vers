import { expect, test } from 'vitest';
import { createCharacter } from '~/entities/create-character';
import { createMockCharacterData } from '~/test-utils/create-mock-character-data';
import { createMockSimulationContext } from '~/test-utils/create-mock-simulation-context';
import { EquipmentSlot, LifecycleEvent } from '~/types';
import { create } from './create';

test('it creates a behaviour with the correct values', () => {
  const characterData = createMockCharacterData({
    paperdoll: {
      [EquipmentSlot.MainHand]: {
        id: 'test-weapon',
        maxDamage: 10,
        minDamage: 10,
        name: 'Test Weapon',
        speed: 1,
      },
    },
  });

  const ctx = createMockSimulationContext();
  const character = createCharacter(characterData, ctx);
  const behaviour = create(character);

  expect(behaviour.lastAttackTime).toBe(0);
  expect(behaviour.nextAttackTime).toBe(1000);
});

test('it handles the reset event', () => {
  const characterData = createMockCharacterData();
  const ctx = createMockSimulationContext();
  const character = createCharacter(characterData, ctx);
  const behaviour = create(character);

  behaviour.setState((draft) => {
    draft.lastAttackTime = 2000;
  });

  behaviour.handlers[LifecycleEvent.Reset]?.(character, ctx);

  expect(behaviour.state).toStrictEqual({
    lastAttackTime: 0,
  });
});
