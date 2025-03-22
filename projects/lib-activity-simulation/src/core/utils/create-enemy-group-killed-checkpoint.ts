import type {
  ActivityEnemyGroupKilledCheckpoint,
  ActivityExecutor,
} from '~/types';
import { ActivityCheckpointType } from '~/types';
import { hashObject } from '~/utils/hash-object';

export function createEnemyGroupKilledCheckpoint(
  executor: ActivityExecutor,
): ActivityEnemyGroupKilledCheckpoint {
  const data = {
    nextSeed: executor.rng.generateNewSeed(),
    time: executor.elapsed,
    type: ActivityCheckpointType.EnemyGroupKilled,
  } satisfies Omit<ActivityEnemyGroupKilledCheckpoint, 'hash'>;

  const hash = hashObject(data);

  return { ...data, hash };
}
