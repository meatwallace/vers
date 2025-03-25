import { afterEach, expect, test } from 'vitest';
import {
  createMockActivityData,
  createMockCharacterData,
  createSimulation,
} from '@vers/idle-core';
import xxhash from 'xxhash-wasm';
import type { InitializeMessage, SetActivityMessage } from '../types';
import { ClientMessageType } from '../types';
import { handleClientMessage } from './handle-client-message';
import { getSimulation, setSimulation } from './simulation';

const hasher = await xxhash();

afterEach(() => {
  setSimulation(null);
});

test('it handles initialization messages', async () => {
  const characterData = createMockCharacterData();

  const message: InitializeMessage = {
    character: characterData,
    seed: 123,
    type: ClientMessageType.Initialize,
  };

  const event = new MessageEvent('message', { data: message });

  await handleClientMessage(event);

  const simulation = getSimulation();

  expect(simulation?.state.character).toMatchObject({
    id: characterData.id,
    level: characterData.level,
  });
});

test('it handles setting the activity', async () => {
  const characterData = createMockCharacterData();
  const simulation = createSimulation(characterData, 123, hasher);

  setSimulation(simulation);

  const activity = createMockActivityData();

  const message: SetActivityMessage = {
    activity,
    type: ClientMessageType.SetActivity,
  };

  const event = new MessageEvent('message', { data: message });

  await handleClientMessage(event);

  expect(simulation.activity?.id).toBe(activity.id);
});
