import invariant from 'tiny-invariant';
import type {
  Activity,
  ActivityCheckpointGenerator,
  Character,
  CombatExecutor,
  SimulationContext,
} from '../types';
import { logger } from '../utils/logger';
import { createCompletedCheckpoint } from './utils/create-completed-checkpoint';
import { createEnemyGroupKilledCheckpoint } from './utils/create-enemy-group-killed-checkpoint';
import { createFailedCheckpoint } from './utils/create-failed-checkpoint';
import { createStartedCheckpoint } from './utils/create-started-checkpoint';

export async function* simulateActivity(
  executor: CombatExecutor,
  activity: Activity,
  character: Character,
  ctx: SimulationContext,
): ActivityCheckpointGenerator {
  invariant(activity, 'activity is required');

  const timestep = yield createStartedCheckpoint(ctx);

  const label = `[activity:${activity.type}]`;

  logger.debug(
    `${label} starting activity with ${activity.enemyGroups.length} enemy groups`,
  );

  logger.debug(
    `${label} starting combat with first group of ${activity.currentEnemyGroup?.enemies.length} enemies`,
  );

  while (character.isAlive && activity.isEnemyGroupsRemaining) {
    executor.run(timestep);

    if (activity.currentEnemyGroup?.remaining === 0) {
      yield createEnemyGroupKilledCheckpoint(activity, ctx);

      logger.debug(`${label} moving to next enemy group`);

      // move to the next enemy group
      executor.reset();
      activity.moveToNextEnemyGroup();
    } else {
      yield null;
    }
  }

  if (!character.isAlive) {
    return createFailedCheckpoint(activity, ctx);
  }

  return createCompletedCheckpoint(activity.elapsed, ctx);
}
