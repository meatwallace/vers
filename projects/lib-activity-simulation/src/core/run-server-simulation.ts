import { UnreachableCodeError } from '@vers/utils';
import { isCompletedCheckpoint } from '~/utils/is-completed-checkpoint';
import { isEnemyGroupKilledCheckpoint } from '~/utils/is-enemy-group-killed-checkpoint';
import { isFailedCheckpoint } from '~/utils/is-failed-checkpoint';
import { isStartedCheckpoint } from '~/utils/is-started-checkpoint';
import { logger } from '~/utils/logger';
import type {
  ActivityCheckpoint,
  ActivityData,
  PlayerCharacterData,
} from '../types';
import { ActivityFailureAction } from '../types';
import { simulateActivity } from './simulate-activity';

/**
 * @property initialSeed - should come from activity initialisation data or a previously simulated checkpoint seed
 * @property duration - how long to run the simulation for. derive from the checkpoint data submitted by the
 * cient, or if simulating offline progress the duration since the last checkpoint (if any)
 * @property finalSeed - if a final seed is provided we will stop processing once we've reached it. useful for
 * verifying client progress.
 */
interface SimulationConfig {
  duration: number;
  finalSeed?: number;
  initialSeed: number;
}

interface SimulationOutput {
  checkpoints: Array<ActivityCheckpoint>;
  elapsed: number;
  finalSeed: number;
}

export async function runServerSimulation(
  activity: ActivityData,
  character: PlayerCharacterData,
  config: SimulationConfig,
): Promise<SimulationOutput> {
  const label = `[activity:${activity.type}]`;

  logger.debug(`${label} starting simulation`);

  let elapsed = 0;
  let seed = config.initialSeed;
  let generator = simulateActivity(activity, character, seed);

  const checkpoints: Array<ActivityCheckpoint> = [];

  while (elapsed < config.duration) {
    const { done, value: checkpoint } = await generator.next();

    const activityExceededDuration =
      checkpoint.time + elapsed > config.duration;

    // if this checkpoint exceeds our duration, bail out
    if (activityExceededDuration) {
      logger.debug(`${label} activity exceeded duration, aborting`);

      // clean up our generator - no idea if this is needed, but it can't hurt (...right?)
      if (!done) {
        // @ts-expect-error - not using a return value as we breakout of our loop
        await generator.return();
      }

      break;
    }

    // it's important we capture all checkpoints so we can replay even from a failure
    checkpoints.push(checkpoint);

    if (isStartedCheckpoint(checkpoint)) {
      logger.debug(`${label} activity started`);

      continue;
    }

    const isFailed = isFailedCheckpoint(checkpoint);

    if (isFailed && activity.failureAction === ActivityFailureAction.Abort) {
      logger.debug(`${label} activity failed, aborting`);

      break;
    }

    if (isFailed && activity.failureAction === ActivityFailureAction.Retry) {
      logger.debug(`${label} activity failed, retrying`);

      elapsed += checkpoint.time;
      seed = checkpoint.nextSeed;

      generator = simulateActivity(activity, character, seed);

      continue;
    }

    if (isEnemyGroupKilledCheckpoint(checkpoint)) {
      logger.debug(`${label} enemy group killed`);

      elapsed += checkpoint.time;

      continue;
    }

    if (isCompletedCheckpoint(checkpoint)) {
      logger.debug(`${label} activity completed`);

      elapsed += checkpoint.time;
      seed = checkpoint.nextSeed;

      generator = simulateActivity(activity, character, seed);

      continue;
    }

    throw new UnreachableCodeError('we should never get here');
  }

  logger.debug(`${label} completed simulation`);

  return {
    checkpoints,
    elapsed,
    finalSeed: seed,
  };
}
