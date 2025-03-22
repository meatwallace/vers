import type { EnemyData, EnemyGroup, EnemyGroupState } from './entities';

interface IActivityData {
  failureAction: ActivityFailureAction;
  id: string;
  type: ActivityType;
}

export enum ActivityType {
  AetherNode = 'aether_node',
}

export enum ActivityFailureAction {
  Abort = 'abort',
  Retry = 'retry',
}

export interface AetherNodeActivityData extends IActivityData {
  enemies: Array<EnemyData>;
  type: ActivityType.AetherNode;
}

export type ActivityData = AetherNodeActivityData;

export interface ActivityState {
  readonly enemyGroups: Array<EnemyGroupState>;
}

export interface Activity {
  // meta
  readonly enemyGroups: Array<EnemyGroup>;
  readonly id: string;
  readonly type: ActivityType;

  // getters
  get currentEnemyGroup(): EnemyGroup;
  get elapsed(): number;
  get isEnemyGroupsRemaining(): boolean;

  // utils
  elapseTime(time: number): void;
  getState(): ActivityState;
  moveToNextEnemyGroup(): void;
}

export type ActivityCheckpointGenerator = AsyncGenerator<
  ActivityCheckpoint | null,
  ActivityCheckpoint,
  number
>;

interface IActivityCheckpoint {
  hash: string;
  time: number;
  type: ActivityCheckpointType;
}

export enum ActivityCheckpointType {
  Completed = 'completed',
  EnemyGroupKilled = 'enemy_group_killed',
  Failed = 'failed',
  Started = 'started',
}

export interface ActivityStartedCheckpoint extends IActivityCheckpoint {
  seed: number;
  type: ActivityCheckpointType.Started;
}

export interface ActivityFailedCheckpoint extends IActivityCheckpoint {
  nextSeed: number;
  type: ActivityCheckpointType.Failed;
}

export interface ActivityCompletedCheckpoint extends IActivityCheckpoint {
  nextSeed: number;
  type: ActivityCheckpointType.Completed;
}

export interface ActivityEnemyGroupKilledCheckpoint
  extends IActivityCheckpoint {
  nextSeed: number;
  type: ActivityCheckpointType.EnemyGroupKilled;
}

export type ActivityCheckpoint =
  | ActivityCompletedCheckpoint
  | ActivityEnemyGroupKilledCheckpoint
  | ActivityFailedCheckpoint
  | ActivityStartedCheckpoint;
