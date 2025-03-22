import { expect, test } from 'vitest';
import { createMockCharacterData } from '~/test-utils/create-mock-character-data';
import { createMockSimulationContext } from '~/test-utils/create-mock-simulation-context';
import { EntityStatus } from '~/types';
import { createCharacter } from '../create-character';
import { handleReceiveCharacterDamage } from './handle-receive-character-damage';

test('it reduces the life of the entity by the amount of damage received', () => {
  const ctx = createMockSimulationContext();
  const characterData = createMockCharacterData({ life: 100 });
  const character = createCharacter(characterData, ctx);

  handleReceiveCharacterDamage(10, character);

  expect(character.life).toBe(90);
});

test('it sets the status to dead if the life is 0 or less', () => {
  const ctx = createMockSimulationContext();
  const characterData = createMockCharacterData({ life: 100 });
  const character = createCharacter(characterData, ctx);

  handleReceiveCharacterDamage(100, character);

  expect(character.status).toBe(EntityStatus.Dead);
});

test('it does not reduce the life below 0', () => {
  const ctx = createMockSimulationContext();
  const characterData = createMockCharacterData({ life: 10 });
  const character = createCharacter(characterData, ctx);

  handleReceiveCharacterDamage(100, character);

  expect(character.life).toBe(0);
});
