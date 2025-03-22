import { expect, test } from 'vitest';
import type {
  ActivityCompletedCheckpoint,
  ActivityEnemyGroupKilledCheckpoint,
  ActivityFailedCheckpoint,
  ActivityStartedCheckpoint,
} from '~/types';
import { ActivityCheckpointType } from '~/types';
import { isEnemyGroupKilledCheckpoint } from './is-enemy-group-killed-checkpoint';

test('returns true for enemy group killed checkpoints', () => {
  const enemyGroupKilledCheckpoint: ActivityEnemyGroupKilledCheckpoint = {
    hash: 'abc123',
    nextSeed: 12_345,
    time: 300,
    type: ActivityCheckpointType.EnemyGroupKilled,
  };

  expect(isEnemyGroupKilledCheckpoint(enemyGroupKilledCheckpoint)).toBeTrue();
});

test('returns false for non-enemy-group-killed checkpoints', () => {
  const startedCheckpoint: ActivityStartedCheckpoint = {
    hash: 'def456',
    seed: 54_321,
    time: 0,
    type: ActivityCheckpointType.Started,
  };

  const completedCheckpoint: ActivityCompletedCheckpoint = {
    hash: 'ghi789',
    nextSeed: 98_765,
    time: 1000,
    type: ActivityCheckpointType.Completed,
  };

  const failedCheckpoint: ActivityFailedCheckpoint = {
    hash: 'jkl012',
    nextSeed: 24_680,
    time: 500,
    type: ActivityCheckpointType.Failed,
  };

  expect(isEnemyGroupKilledCheckpoint(startedCheckpoint)).toBeFalse();
  expect(isEnemyGroupKilledCheckpoint(completedCheckpoint)).toBeFalse();
  expect(isEnemyGroupKilledCheckpoint(failedCheckpoint)).toBeFalse();
});
