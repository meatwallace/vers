import { expect, test, vi } from 'vitest';
import type { PlayerTestBehaviour } from '~/types';
import { createActivity } from '~/core/create-activity';
import { createCombatExecutor } from '~/core/create-combat-executor';
import { createMockActivityData } from '~/test-utils/create-mock-activity-data';
import { createMockCharacterData } from '~/test-utils/create-mock-character-data';
import { createMockSimulationContext } from '~/test-utils/create-mock-simulation-context';
import { BehaviourID, EntityStatus, EntityType, LifecycleEvent } from '~/types';
import { createCharacter } from './create-character';

test('it creates a character with correct initial values', () => {
  const ctx = createMockSimulationContext();
  const data = createMockCharacterData();

  const character = createCharacter(data, ctx);

  expect(character.id).toStrictEqual(expect.any(String));
  expect(character.level).toBe(data.level);
  expect(character.type).toBe(EntityType.Character);
  expect(character.life).toBe(data.life);
  expect(character.status).toBe(EntityStatus.Alive);
  expect(character.isAlive).toBeTrue();
});

test('it exposes a method for setting the character state', () => {
  const ctx = createMockSimulationContext();
  const data = createMockCharacterData();
  const character = createCharacter(data, ctx);

  character.setState((draftState) => {
    draftState.life = 9999;
  });

  expect(character.life).toBe(9999);
});

test('it reduces life and updates status when killed', () => {
  const ctx = createMockSimulationContext();
  const data = createMockCharacterData({
    life: 100,
  });

  const character = createCharacter(data, ctx);

  character.receiveDamage(10);

  expect(character.life).toBe(90);
  expect(character.status).toBe(EntityStatus.Alive);
  expect(character.isAlive).toBeTrue();

  // overkill by 5
  character.receiveDamage(95);

  expect(character.life).toBe(0);
  expect(character.status).toBe(EntityStatus.Dead);
  expect(character.isAlive).toBeFalse();
});

test('it calls all registered handlers when handling a tick', () => {
  const ctx = createMockSimulationContext();
  const characterData = createMockCharacterData();
  const character = createCharacter(characterData, ctx);
  const activityData = createMockActivityData();
  const activity = createActivity(activityData, ctx);
  const combatExecutor = createCombatExecutor(activity, character, ctx);

  const handlerSpy = vi.fn();

  const behaviour: PlayerTestBehaviour = {
    handlers: {
      [LifecycleEvent.OnTick]: handlerSpy,
    },
    id: BehaviourID.Test,
    predicate: () => true,
    setState: vi.fn(),
    state: {},
  };

  character.addBehaviour(behaviour);
  character.handleTick(combatExecutor, ctx);

  expect(handlerSpy).toHaveBeenCalledWith(character, combatExecutor, ctx);
});

test('it allows removing behaviours', () => {
  const ctx = createMockSimulationContext();
  const characterData = createMockCharacterData();
  const character = createCharacter(characterData, ctx);
  const activityData = createMockActivityData();
  const activity = createActivity(activityData, ctx);
  const combatExecutor = createCombatExecutor(activity, character, ctx);

  const handlerSpy = vi.fn();

  const behaviour: PlayerTestBehaviour = {
    handlers: {
      [LifecycleEvent.OnTick]: handlerSpy,
    },
    id: BehaviourID.Test,
    predicate: () => true,
    setState: vi.fn(),
    state: {},
  };

  character.addBehaviour(behaviour);
  character.removeBehaviour(BehaviourID.Test);
  character.handleTick(combatExecutor, ctx);

  expect(handlerSpy).not.toHaveBeenCalled();
});

test('it exposes a method for resetting the character', () => {
  const ctx = createMockSimulationContext();
  const characterData = createMockCharacterData({ life: 100 });
  const character = createCharacter(characterData, ctx);

  character.receiveDamage(100);

  expect(character.life).toBe(0);
  expect(character.status).toBe(EntityStatus.Dead);
  expect(character.isAlive).toBeFalse();

  character.reset();

  expect(character.life).toBe(100);
  expect(character.status).toBe(EntityStatus.Alive);
  expect(character.isAlive).toBeTrue();
});

test('it resets all behaviour states when resetting the character', () => {
  const ctx = createMockSimulationContext();
  const characterData = createMockCharacterData();
  const character = createCharacter(characterData, ctx);

  const resetHandlerSpy = vi.fn();

  const behaviour: PlayerTestBehaviour = {
    handlers: {
      [LifecycleEvent.Reset]: resetHandlerSpy,
    },
    id: BehaviourID.Test,
    predicate: () => true,
    setState: vi.fn(),
    state: {},
  };

  character.addBehaviour(behaviour);

  character.reset();

  expect(resetHandlerSpy).toHaveBeenCalledWith(character, ctx);
});

test('it allows for preserving character state when resetting', () => {
  const ctx = createMockSimulationContext();
  const characterData = createMockCharacterData({ life: 100 });
  const character = createCharacter(characterData, ctx);

  const resetHandlerSpy = vi.fn();

  const behaviour: PlayerTestBehaviour = {
    handlers: {
      [LifecycleEvent.Reset]: resetHandlerSpy,
    },
    id: BehaviourID.Test,
    predicate: () => true,
    setState: vi.fn(),
    state: {
      count: 0,
    },
  };

  character.addBehaviour(behaviour);
  character.receiveDamage(100);

  expect(character.life).toBe(0);
  expect(character.status).toBe(EntityStatus.Dead);
  expect(character.isAlive).toBeFalse();

  character.reset({ soft: true });

  expect(resetHandlerSpy).toHaveBeenCalledWith(character, ctx);
  expect(character.life).toBe(0);
  expect(character.status).toBe(EntityStatus.Dead);
  expect(character.isAlive).toBeFalse();
});
