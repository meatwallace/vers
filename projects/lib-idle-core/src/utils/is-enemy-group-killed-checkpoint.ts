import type {
  ActivityCheckpoint,
  ActivityEnemyGroupKilledCheckpoint,
} from '../types';
import { ActivityCheckpointType } from '../types';

export function isEnemyGroupKilledCheckpoint(
  checkpoint: ActivityCheckpoint,
): checkpoint is ActivityEnemyGroupKilledCheckpoint {
  return checkpoint.type === ActivityCheckpointType.EnemyGroupKilled;
}
