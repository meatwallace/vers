import { afterEach, expect, test, vi } from 'vitest';
import { createSimulation } from '@vers/idle-core';
import xxhash from 'xxhash-wasm';
import { WorkerMessageType } from '../types';
import { connections } from './connections';
import { handleSimulationUpdate } from './handle-simulation-update';
import { setSimulation } from './simulation';

const hasher = await xxhash();

afterEach(() => {
  setSimulation(null);

  connections.clear();
});

test('it sends simulation update messages to all connections', () => {
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

  const simulation = createSimulation(hasher);

  setSimulation(simulation);

  handleSimulationUpdate();

  expect(postMessageSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      state: simulation.getAppState(),
      type: WorkerMessageType.SimulationUpdate,
    }),
  );
});
