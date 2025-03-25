import type {
  Activity,
  ActivityEnemyGroupKilledCheckpoint,
  SimulationContext,
} from '../../types';
import { ActivityCheckpointType } from '../../types';
import { hashObject } from '../../utils/hash-object';

export function createEnemyGroupKilledCheckpoint(
  activity: Activity,
  ctx: SimulationContext,
): ActivityEnemyGroupKilledCheckpoint {
  const data: Omit<ActivityEnemyGroupKilledCheckpoint, 'hash'> = {
    nextSeed: ctx.rng.generateNewSeed(),
    time: activity.elapsed,
    type: ActivityCheckpointType.EnemyGroupKilled,
  };

  const hash = hashObject(ctx.hasher, data);

  return { ...data, hash };
}
