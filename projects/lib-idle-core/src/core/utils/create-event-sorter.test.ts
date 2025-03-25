import { expect, test } from 'vitest';
import type { CharacterAttackEvent, EnemyAttackEvent } from '../../types';
import { createCharacter } from '../../entities/create-character';
import { createMockCharacterData } from '../../test-utils/create-mock-character-data';
import { createMockSimulationContext } from '../../test-utils/create-mock-simulation-context';
import { CombatEventType } from '../../types';
import { createEventSorter } from './create-event-sorter';

test('it sorts events by time', () => {
  const ctx = createMockSimulationContext();
  const data = createMockCharacterData();
  const character = createCharacter(data, ctx);

  const event1: EnemyAttackEvent = {
    id: 'event-1',
    source: 'enemy-1',
    time: 100,
    type: CombatEventType.EnemyAttack,
  };

  const event2: EnemyAttackEvent = {
    id: 'event-2',
    source: 'enemy-2',
    time: 50,
    type: CombatEventType.EnemyAttack,
  };

  const events = [event1, event2];
  const sorter = createEventSorter(character);

  events.sort(sorter);

  expect(events).toStrictEqual([event2, event1]);
});

test('it prioritizes character events when time is equal', () => {
  const ctx = createMockSimulationContext();
  const data = createMockCharacterData();
  const character = createCharacter(data, ctx);

  const playerEvent: CharacterAttackEvent = {
    id: 'event-1',
    source: character.id,
    time: 100,
    type: CombatEventType.CharacterAttack,
  };

  const enemyEvent2: EnemyAttackEvent = {
    id: 'event-2',
    source: 'enemy-1',
    time: 100,
    type: CombatEventType.EnemyAttack,
  };

  const enemyEvent3: EnemyAttackEvent = {
    id: 'event-3',
    source: 'enemy-2',
    time: 100,
    type: CombatEventType.EnemyAttack,
  };

  const events = [enemyEvent2, enemyEvent3, playerEvent];
  const sorter = createEventSorter(character);

  events.sort(sorter);

  expect(events).toStrictEqual([playerEvent, enemyEvent2, enemyEvent3]);
});
