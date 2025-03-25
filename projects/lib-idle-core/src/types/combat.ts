export interface CombatExecutorAppState {
  elapsed: number;
}

export interface CombatExecutor {
  // getters
  get elapsed(): number;

  // utils
  getAppState(): CombatExecutorAppState;
  reset(): void;
  run(delta: number): void;
  scheduleEvent(event: CombatEvent): void;
}

interface ICombatEvent {
  id: string;
  source: string;
  time: number;
  type: CombatEventType;
}

export enum CombatEventType {
  CharacterAttack = 'character_attack',
  EnemyAttack = 'enemy_attack',
}

export interface CharacterAttackEvent extends ICombatEvent {
  type: CombatEventType.CharacterAttack;
}

export interface EnemyAttackEvent extends ICombatEvent {
  type: CombatEventType.EnemyAttack;
}

export type CombatEvent = CharacterAttackEvent | EnemyAttackEvent;

export type AttackEvent = CharacterAttackEvent | EnemyAttackEvent;
