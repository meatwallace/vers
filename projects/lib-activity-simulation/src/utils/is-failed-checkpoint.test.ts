import { expect, test } from 'vitest';
import type {
  ActivityCompletedCheckpoint,
  ActivityEnemyGroupKilledCheckpoint,
  ActivityFailedCheckpoint,
  ActivityStartedCheckpoint,
} from '~/types';
import { ActivityCheckpointType } from '~/types';
import { isFailedCheckpoint } from './is-failed-checkpoint';

test('returns true for failed checkpoints', () => {
  const failedCheckpoint: ActivityFailedCheckpoint = {
    hash: 'abc123',
    nextSeed: 12_345,
    time: 500,
    type: ActivityCheckpointType.Failed,
  };

  expect(isFailedCheckpoint(failedCheckpoint)).toBeTrue();
});

test('returns false for non-failed checkpoints', () => {
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

  const enemyGroupKilledCheckpoint: ActivityEnemyGroupKilledCheckpoint = {
    hash: 'jkl012',
    nextSeed: 24_680,
    time: 300,
    type: ActivityCheckpointType.EnemyGroupKilled,
  };

  expect(isFailedCheckpoint(startedCheckpoint)).toBeFalse();
  expect(isFailedCheckpoint(completedCheckpoint)).toBeFalse();
  expect(isFailedCheckpoint(enemyGroupKilledCheckpoint)).toBeFalse();
});
