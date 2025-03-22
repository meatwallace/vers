import type { ActivityCompletedCheckpoint, ActivityExecutor } from '~/types';
import { ActivityCheckpointType } from '~/types';
import { hashObject } from '~/utils/hash-object';

export function createCompletedCheckpoint(
  executor: ActivityExecutor,
): ActivityCompletedCheckpoint {
  const result = {
    nextSeed: executor.rng.generateNewSeed(),
    time: executor.elapsed,
    type: ActivityCheckpointType.Completed,
  } satisfies Omit<ActivityCompletedCheckpoint, 'hash'>;

  const hash = hashObject(result);

  return { ...result, hash };
}
