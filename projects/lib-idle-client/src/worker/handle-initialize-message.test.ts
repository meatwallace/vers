import { afterEach, expect, test, vi } from 'vitest';
import { createMockCharacterData, createSimulation } from '@vers/idle-core';
import xxhash from 'xxhash-wasm';
import type { InitializeMessage } from '../types';
import { ClientMessageType, WorkerMessageType } from '../types';
import { connections } from './connections';
import { handleInitializeMessage } from './handle-initialize-message';
import { getSimulation, setSimulation } from './simulation';

const hasher = await xxhash();

afterEach(() => {
  setSimulation(null);

  connections.clear();
});

test('it initializes the simulation', async () => {
  const characterData = createMockCharacterData();

  const message: InitializeMessage = {
    character: characterData,
    seed: 123,
    type: ClientMessageType.Initialize,
  };

  await handleInitializeMessage(message);

  const simulation = getSimulation();

  expect(simulation).toBeDefined();
  expect(simulation?.state.character.id).toBe(characterData.id);
  expect(simulation?.seed).toBe(message.seed);
});

test('it sends an initial state message to all connections', async () => {
  const postMessageSpy = vi.fn();

  const mockPort: MessagePort = {
    addEventListener: vi.fn(),
    close: vi.fn(),
    dispatchEvent: vi.fn(),
    onmessage: vi.fn(),
    onmessageerror: vi.fn(),
    postMessage: postMessageSpy,
    removeEventListener: vi.fn(),
    start: vi.fn(),
  };

  connections.add(mockPort);

  const characterData = createMockCharacterData();

  const message: InitializeMessage = {
    character: characterData,
    seed: 123,
    type: ClientMessageType.Initialize,
  };

  await handleInitializeMessage(message);

  const simulation = getSimulation();

  expect(postMessageSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      state: simulation?.getAppState(),
      type: WorkerMessageType.InitialState,
    }),
  );
});

test('it does not create a new simulation if one already exists', async () => {
  const characterData = createMockCharacterData();
  const existingSimulation = createSimulation(characterData, 123, hasher);

  setSimulation(existingSimulation);

  const message: InitializeMessage = {
    character: characterData,
    seed: 456,
    type: ClientMessageType.Initialize,
  };

  await handleInitializeMessage(message);

  const simulation = getSimulation();

  expect(simulation).toBe(existingSimulation);
});
