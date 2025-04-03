import { afterEach, expect, test, vi } from 'vitest';
import { createSimulation } from '@vers/idle-core';
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
  const message: InitializeMessage = {
    type: ClientMessageType.Initialize,
  };

  await handleInitializeMessage(message);

  const simulation = getSimulation();

  expect(simulation).not.toBeNull();
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

  const message: InitializeMessage = {
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
  const existingSimulation = createSimulation(hasher);

  setSimulation(existingSimulation);

  const message: InitializeMessage = {
    type: ClientMessageType.Initialize,
  };

  await handleInitializeMessage(message);

  const simulation = getSimulation();

  expect(simulation).toBe(existingSimulation);
});
