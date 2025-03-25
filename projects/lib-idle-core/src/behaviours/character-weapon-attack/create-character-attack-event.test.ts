import { expect, test } from 'vitest';
import { createCharacter } from '../../entities/create-character';
import { createMockCharacterData } from '../../test-utils/create-mock-character-data';
import { createMockSimulationContext } from '../../test-utils/create-mock-simulation-context';
import { CombatEventType } from '../../types';
import { createCharacterAttackEvent } from './create-character-attack-event';

test('it creates a character attack event', () => {
  const characterData = createMockCharacterData();
  const ctx = createMockSimulationContext();
  const character = createCharacter(characterData, ctx);
  const time = 1000;

  const event = createCharacterAttackEvent(character, time);

  expect(event).toStrictEqual({
    id: expect.any(String),
    source: character.id,
    time,
    type: CombatEventType.CharacterAttack,
  });
});
