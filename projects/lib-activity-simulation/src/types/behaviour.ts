import type {
  Character,
  CombatExecutor,
  Enemy,
  Entity,
  SetEntityStateFn,
  SimulationContext,
} from '~/types';

type BehaviourState<T> = Record<string, unknown> & T;

export interface IBehaviour<
  T extends Entity,
  S extends BehaviourState<object> = BehaviourState<object>,
> {
  // meta
  readonly id: BehaviourID;

  // getters
  get state(): S;

  // handlers
  handlers: {
    [LifecycleEvent.Death]?: LifecycleHandler<T>;
    [LifecycleEvent.Initialize]?: LifecycleHandler<T>;
    [LifecycleEvent.OnTick]?: CombatLifecycleHandler<T>;
    [LifecycleEvent.Reset]?: LifecycleHandler<T>;
  };

  // core
  predicate: (entity: T) => boolean;
  setState: (setStateFn: SetEntityStateFn<S>) => void;
}

export type LifecycleHandler<T extends Entity> = (
  entity: T,
  ctx: SimulationContext,
) => void;

export type CombatLifecycleHandler<T extends Entity> = (
  entity: T,
  combatExecutor: CombatExecutor,
  ctx: SimulationContext,
) => void;

export enum LifecycleEvent {
  Death = 'death',
  Initialize = 'initialize',
  OnTick = 'onTick',
  Reset = 'reset',
}

export enum BehaviourID {
  EnemyPrimaryAttack = 'enemy_primary_attack',
  PlayerWeaponAttack = 'player_weapon_attack',
  Test = 'test',
}

export type PlayerWeaponAttackBehaviourState = BehaviourState<{
  readonly lastAttackTime: number;
}>;

export interface PlayerWeaponAttackBehaviour
  extends IBehaviour<Character, PlayerWeaponAttackBehaviourState> {
  // meta
  readonly id: BehaviourID.PlayerWeaponAttack;

  // getters
  get lastAttackTime(): number;
  get nextAttackTime(): number;
}

export type EnemyPrimaryAttackBehaviourState = BehaviourState<{
  readonly lastAttackTime: number;
}>;

export interface EnemyPrimaryAttackBehaviour
  extends IBehaviour<Enemy, EnemyPrimaryAttackBehaviourState> {
  // meta
  readonly id: BehaviourID.EnemyPrimaryAttack;

  // getters
  get lastAttackTime(): number;
  get nextAttackTime(): number;
}

export interface PlayerTestBehaviour
  extends IBehaviour<Character, Record<never, never>> {
  readonly id: BehaviourID.Test;
}

export interface EnemyTestBehaviour
  extends IBehaviour<Enemy, Record<never, never>> {
  readonly id: BehaviourID.Test;
}

export type Behaviour =
  | EnemyPrimaryAttackBehaviour
  | PlayerTestBehaviour
  | PlayerWeaponAttackBehaviour;
