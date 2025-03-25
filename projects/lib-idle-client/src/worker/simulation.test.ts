import { afterEach, expect, test } from 'vitest';
import { createMockCharacterData, createSimulation } from '@vers/idle-core';
import xxhash from 'xxhash-wasm';
import { getSimulation, setSimulation } from './simulation';

const hasher = await xxhash();

afterEach(() => {
  setSimulation(null);
});

test('it sets the current simulation', () => {
  const characterData = createMockCharacterData();
  const simulation = createSimulation(characterData, 123, hasher);

  setSimulation(simulation);

  const result = getSimulation();

  expect(result).toStrictEqual(simulation);
});
