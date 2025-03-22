import type { ActivityStartedCheckpoint } from '~/types';
import { ActivityCheckpointType } from '~/types';
import { hashObject } from '~/utils/hash-object';

export function createStartedCheckpoint(
  seed: number,
): ActivityStartedCheckpoint {
  const result = {
    seed,
    time: 0,
    type: ActivityCheckpointType.Started,
  } satisfies Omit<ActivityStartedCheckpoint, 'hash'>;

  const hash = hashObject(result);

  return { ...result, hash };
}
