import { expect, test } from 'vitest';
import { postMessageAndWaitForReply } from '@vers/client-test-utils';
import {
  createMockActivityData,
  createMockCharacterData,
} from '@vers/idle-core';
import type { InitializeMessage, SetActivityMessage } from '../types';
import { ClientMessageType, WorkerMessageType } from '../types';
import SimulationWorker from './worker.ts?sharedworker';

test('it sends the initial state', async () => {
  const characterData = createMockCharacterData();
  const worker = new SimulationWorker();

  const message: InitializeMessage = {
    character: characterData,
    seed: 123,
    type: ClientMessageType.Initialize,
  };

  const event = await postMessageAndWaitForReply(worker, message);

  expect(event.data.type).toBe(WorkerMessageType.InitialState);
});

test('it processes simulation updates', async () => {
  const characterData = createMockCharacterData();
  const worker = new SimulationWorker();

  const initializeMessage: InitializeMessage = {
    character: characterData,
    seed: 123,
    type: ClientMessageType.Initialize,
  };

  const activityData = createMockActivityData();

  const setActivityMessage: SetActivityMessage = {
    activity: activityData,
    type: ClientMessageType.SetActivity,
  };

  await postMessageAndWaitForReply(worker, initializeMessage);

  const event = await postMessageAndWaitForReply(worker, setActivityMessage);

  expect(event.data.type).toBe(WorkerMessageType.SimulationUpdate);
});
