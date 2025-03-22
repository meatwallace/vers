import type { ActivityStartedCheckpoint, SimulationContext } from '~/types';
import { ActivityCheckpointType } from '~/types';
import { hashObject } from '~/utils/hash-object';

export function createStartedCheckpoint(
  ctx: SimulationContext,
): ActivityStartedCheckpoint {
  const result: Omit<ActivityStartedCheckpoint, 'hash'> = {
    seed: ctx.rng.seed,
    time: 0,
    type: ActivityCheckpointType.Started,
  };

  const hash = hashObject(result);

  return { ...result, hash };
}
