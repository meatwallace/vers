import { expect, test } from 'vitest';
import type {
  ActivityCompletedCheckpoint,
  ActivityFailedCheckpoint,
  ActivityProgressCheckpoint,
  ActivityStartedCheckpoint,
} from '../types';
import { ActivityCheckpointType } from '../types';
import { isProgressCheckpoint } from './is-progress-checkpoint';

test('returns true for progress checkpoints', () => {
  const progressCheckpoint: ActivityProgressCheckpoint = {
    hash: 'abc123',
    nextSeed: 12_345,
    time: 300,
    type: ActivityCheckpointType.Progress,
  };

  expect(isProgressCheckpoint(progressCheckpoint)).toBeTrue();
});

test('returns false for non-progress checkpoints', () => {
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

  expect(isProgressCheckpoint(startedCheckpoint)).toBeFalse();
  expect(isProgressCheckpoint(completedCheckpoint)).toBeFalse();
  expect(isProgressCheckpoint(failedCheckpoint)).toBeFalse();
});
