import { expect, test } from 'vitest';
import type { SimulationAppState } from '@vers/idle-core';
import { EntityStatus } from '@vers/idle-core';
import { WorkerMessageType } from '../types';
import { createSimulationUpdateMessage } from './create-simulation-update-message';

test('it creates a simulation update message', () => {
  const state: SimulationAppState = {
    activity: {
      currentEnemyGroup: null,
      elapsed: 1000,
      enemiesRemaining: 0,
      enemyGroups: [],
      enemyGroupsRemaining: 0,
      id: '1',
      name: 'Test Activity',
    },
    avatar: {
      behaviours: {},
      id: '1',
      image: '/assets/images/avatar-placeholder.png',
      isAlive: true,
      level: 1,
      life: 100,
      mainHandAttack: null,
      maxLife: 100,
      name: 'Test Avatar',
      status: EntityStatus.Alive,
    },
    combat: { elapsed: 1000 },
  };

  const message = createSimulationUpdateMessage(state);

  expect(message).toStrictEqual({
    state,
    type: WorkerMessageType.SimulationUpdate,
  });
});
