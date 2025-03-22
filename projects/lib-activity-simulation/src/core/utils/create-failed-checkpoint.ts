import type { ActivityExecutor, ActivityFailedCheckpoint } from '~/types';
import { ActivityCheckpointType } from '~/types';
import { hashObject } from '~/utils/hash-object';

export function createFailedCheckpoint(
  executor: ActivityExecutor,
): ActivityFailedCheckpoint {
  const result = {
    nextSeed: executor.rng.generateNewSeed(),
    time: executor.elapsed,
    type: ActivityCheckpointType.Failed,
  } satisfies Omit<ActivityFailedCheckpoint, 'hash'>;

  const hash = hashObject(result);

  return { ...result, hash };
}
