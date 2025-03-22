import type { BehaviourID, IBehaviour } from './behaviour';
import type { CombatExecutor } from './combat';
import type { SetEntityStateFn } from './core';
import type { EquipmentSlot, EquipmentWeapon } from './equipment';
import type { SimulationContext } from './simulation';

export interface CharacterData {
  id: string;
  level: number;
  life: number;
  // TODO: implement this as a map? type? where we use a record to enforce equipment type e.g. 1h/2h weapons = weapons, etc
  paperdoll: {
    [EquipmentSlot.MainHand]: EquipmentWeapon | null;
    // [EquipmentSlot.OffHand]: EquipmentWeapon;
  };
}

export interface EnemyData {
  level: number;
  life: number;
  name: string;
  primaryAttack: AttackData;
}

export type HandleTickFn = (combatExecutor: CombatExecutor) => void;

interface IEntity<S extends object> {
  // meta
  readonly id: string;
  readonly level: number;
  readonly type: EntityType;

  // getters
  get isAlive(): boolean;
  get life(): number;
  get status(): EntityStatus;

  // core
  addBehaviour(behaviour: IBehaviour<Entity>): void;
  getState(): S;
  handleTick(combatExecutor: CombatExecutor, ctx: SimulationContext): void;
  removeBehaviour(id: BehaviourID): void;
  setState(setStateFn: SetEntityStateFn<S>): void;

  // utils
  receiveDamage(amount: number): void;
}

export type Entity = Character | Enemy;

interface ResetConfig {
  soft?: boolean;
}

export interface CharacterState {
  readonly life: number;
  readonly status: EntityStatus;
}

export interface Character extends IEntity<CharacterState> {
  // meta
  readonly type: EntityType.Character;

  // getters
  get mainHandEquipment(): EquipmentWeapon | null;

  // core
  addBehaviour(behaviour: IBehaviour<Character>): void;

  // utils
  calcAttackDamage(): number;
  reset(config?: ResetConfig): void;
}

export interface EnemyState {
  readonly life: number;
  readonly status: EntityStatus;
}

export interface Enemy extends IEntity<EnemyState> {
  // meta
  readonly name: string;
  readonly type: EntityType.Enemy;

  // getters
  get primaryAttack(): AttackData;

  // core
  addBehaviour(behaviour: IBehaviour<Enemy>): void;

  // utils
  calcAttackDamage(): number;
}

export enum EntityStatus {
  Alive = 'alive',
  Dead = 'dead',
}

export enum EntityType {
  Character = 'player_character',
  Enemy = 'enemy',
}

export interface AttackData {
  maxDamage: number;
  minDamage: number;
  speed: number;
}

export interface EnemyGroupState {
  readonly enemies: Array<EnemyState>;
  readonly id: string;
}

export interface EnemyGroup {
  // meta
  readonly enemies: Array<Enemy>;
  readonly id: string;

  // getters
  get nextLivingEnemy(): Enemy | null;
  get remaining(): number;

  // utils
  getState(): EnemyGroupState;
}
