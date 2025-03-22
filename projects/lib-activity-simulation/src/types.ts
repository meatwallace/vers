export interface PlayerCharacterData {
  id: string;
  level: number;
  life: number;
  // TODO: implement this as a map? type? where we use a record to enforce equipment type e.g. 1h/2h weapons = weapons, etc
  paperdoll: {
    [EquipmentSlot.TwoHandedWeapon]: EquipmentWeapon;
  };
}

interface IEquipment {
  id: string;
  name: string;
}

interface EquipmentWeapon extends IEquipment {
  maxDamage: number;
  minDamage: number;
  speed: number;
}

export enum EquipmentSlot {
  OneHandedWeapon = 'one_handed_weapon',
  TwoHandedWeapon = 'two_handed_weapon',
}

export enum EntityStatus {
  Alive = 'alive',
  Dead = 'dead',
}

export enum EntityType {
  Enemy = 'enemy',
  PlayerCharacter = 'player_character',
}

interface IEntity {
  // meta
  readonly id: string;
  readonly level: number;
  readonly type: EntityType;

  // getters
  get attack(): AttackData;
  get isAlive(): boolean;
  get life(): number;
  get status(): EntityStatus;

  // core
  handleTick(executor: CombatExecutor): void;

  // utils
  getAttackDamage(): number;
  receiveDamage(amount: number): void;
}

export interface PlayerCharacter extends IEntity {
  readonly type: EntityType.PlayerCharacter;
}

export interface AttackData {
  maxDamage: number;
  minDamage: number;
  speed: number;
}

export interface EnemyData {
  level: number;
  life: number;
  primaryAttack: AttackData;
}

export interface Enemy extends IEntity {
  readonly type: EntityType.Enemy;
}

export type Entity = Enemy | PlayerCharacter;

export interface RNG {
  generateNewSeed: () => number;
  getInt: (min: number, max: number) => number;
  getSeries: (min: number, max: number, count: number) => Array<number>;
}

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

export interface ActivityExecutor {
  // meta
  readonly rng: RNG;

  // getters
  get elapsed(): number;

  // utils
  tick(delta: number): void;
}

export interface EnemyGroup {
  // meta
  readonly enemies: Array<Enemy>;
  readonly id: string;

  // getters
  get nextLivingEnemy(): Enemy;
  get remaining(): number;
}

export interface CombatExecutor {
  // getters
  get elapsed(): number;

  // utils
  run(delta: number): void;
  scheduleEvent(event: CombatEvent): void;
}

export type HandleTickFn = (combatExecutor: CombatExecutor) => void;

interface ICombatEvent {
  id: string;
  source: string;
  time: number;
  type: CombatEventType;
}

export enum CombatEventType {
  EnemyAttack = 'enemy_attack',
  PlayerAttack = 'player_attack',
}

export interface PlayerAttackEvent extends ICombatEvent {
  type: CombatEventType.PlayerAttack;
}

export interface EnemyAttackEvent extends ICombatEvent {
  type: CombatEventType.EnemyAttack;
}

export type CombatEvent = EnemyAttackEvent | PlayerAttackEvent;

export type AttackEvent = EnemyAttackEvent | PlayerAttackEvent;
