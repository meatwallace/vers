import { expect, test } from 'vitest';
import { ActivityFailureAction, ActivityType } from '@vers/idle-core';
import type { InitializeMessage, SetActivityMessage } from '../types';
import { ClientMessageType } from '../types';
import { isInitializeMessage } from './is-initialize-message';

test('it returns true if it is an initialize message', () => {
  const message: InitializeMessage = {
    character: {
      id: '1',
      image: '/assets/images/character-placeholder.png',
      level: 1,
      life: 100,
      name: 'Test Character',
      paperdoll: { mainHand: null },
    },
    seed: 123,
    type: ClientMessageType.Initialize,
  };

  expect(isInitializeMessage(message)).toBeTruthy();
});

test('it returns false if it is not an initialize message', () => {
  const message: SetActivityMessage = {
    activity: {
      enemies: [],
      failureAction: ActivityFailureAction.Retry,
      id: 'test',
      name: 'Test Activity',
      type: ActivityType.AetherNode,
    },
    type: ClientMessageType.SetActivity,
  };

  expect(isInitializeMessage(message)).toBeFalsy();
});
