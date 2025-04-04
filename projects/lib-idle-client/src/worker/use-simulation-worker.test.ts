import { afterEach, expect, test } from 'vitest';
import { renderHook } from '@testing-library/react';
import { postMessageAndWaitForReply } from '@vers/client-test-utils';
import { createMockActivityData, createMockAvatarData } from '@vers/idle-core';
import { setSimulationWorker } from 'src/state/set-simulation-worker';
import invariant from 'tiny-invariant';
import type { InitializeMessage, SetActivityMessage } from '../types';
import { ClientMessageType, WorkerMessageType } from '../types';
import { useSimulationWorker } from './use-simulation-worker';
import SimulationWorker from './worker.ts?sharedworker';

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// if we don't wait between tests, the worker won't be killed and doesn't
// get re-initialized in the next test correctly. nothing less than 100ms
// is reliable. this seems to be related to it being initialized in the hook;
// everything works as expected in our worker.ts tests.
afterEach(async () => {
  await wait(500);
});

test('it initializes the worker connection', () => {
  const { rerender, result, unmount } = renderHook(() => useSimulationWorker());

  rerender();

  expect(result.current).toBeInstanceOf(SharedWorker);

  unmount();
});

test('it returns an existing worker instead of creating a new one', () => {
  const worker = new SimulationWorker();

  setSimulationWorker(worker);

  const { result } = renderHook(() => useSimulationWorker());

  expect(result.current).toBe(worker);
});

test('it handles state updates from worker', async () => {
  const { rerender, result } = renderHook(() => useSimulationWorker());

  rerender();

  expect(result.current).toBeInstanceOf(SharedWorker);

  invariant(result.current, 'Worker not initialized');

  const initializeMessage: InitializeMessage = {
    type: ClientMessageType.Initialize,
  };

  const firstEvent = await postMessageAndWaitForReply(
    result.current,
    initializeMessage,
  );

  expect(firstEvent.data.type).toBe(WorkerMessageType.InitialState);

  const setActivityMessage: SetActivityMessage = {
    activity: createMockActivityData(),
    avatar: createMockAvatarData(),
    type: ClientMessageType.SetActivity,
  };

  const secondEvent = await postMessageAndWaitForReply(
    result.current,
    setActivityMessage,
  );

  expect(secondEvent.data.type).toBe(WorkerMessageType.SimulationUpdate);
});
