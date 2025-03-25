import { expect, test } from 'vitest';
import { ActivityFailureAction, ActivityType } from '@vers/idle-core';
import type { InitializeMessage, SetActivityMessage } from '../types';
import { ClientMessageType } from '../types';
import { isSetActivityMessage } from './is-set-activity-message';

test('it returns true if it is a set activity message', () => {
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

  expect(isSetActivityMessage(message)).toBeTruthy();
});

test('it returns false if it is not a set activity message', () => {
  const message: InitializeMessage = {
    character: {
      id: '1',
      level: 1,
      life: 100,
      name: 'Test Character',
      paperdoll: {
        mainHand: null,
      },
    },
    seed: 123,
    type: ClientMessageType.Initialize,
  };

  expect(isSetActivityMessage(message)).toBeFalsy();
});
