import { expect, test } from 'vitest';
import type {
  ActivityCompletedCheckpoint,
  ActivityEnemyGroupKilledCheckpoint,
  ActivityFailedCheckpoint,
  ActivityStartedCheckpoint,
} from '~/types';
import { ActivityCheckpointType } from '~/types';
import { isCompletedCheckpoint } from './is-completed-checkpoint';

test('returns true for completed checkpoints', () => {
  const completedCheckpoint: ActivityCompletedCheckpoint = {
    hash: 'abc123',
    nextSeed: 12_345,
    time: 1000,
    type: ActivityCheckpointType.Completed,
  };

  expect(isCompletedCheckpoint(completedCheckpoint)).toBeTrue();
});

test('returns false for non-completed checkpoints', () => {
  const startedCheckpoint: ActivityStartedCheckpoint = {
    hash: 'def456',
    seed: 54_321,
    time: 0,
    type: ActivityCheckpointType.Started,
  };

  const failedCheckpoint: ActivityFailedCheckpoint = {
    hash: 'ghi789',
    nextSeed: 98_765,
    time: 500,
    type: ActivityCheckpointType.Failed,
  };

  const enemyGroupKilledCheckpoint: ActivityEnemyGroupKilledCheckpoint = {
    hash: 'jkl012',
    nextSeed: 24_680,
    time: 300,
    type: ActivityCheckpointType.EnemyGroupKilled,
  };

  expect(isCompletedCheckpoint(startedCheckpoint)).toBeFalse();
  expect(isCompletedCheckpoint(failedCheckpoint)).toBeFalse();
  expect(isCompletedCheckpoint(enemyGroupKilledCheckpoint)).toBeFalse();
});
