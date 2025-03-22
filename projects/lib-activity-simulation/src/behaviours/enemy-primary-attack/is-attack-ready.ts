import type {
  CombatExecutor,
  Enemy,
  EnemyPrimaryAttackBehaviourState,
} from '~/types';
import { getNextAttackTime } from './get-next-attack-time';

export function isAttackReady(
  entity: Enemy,
  state: EnemyPrimaryAttackBehaviourState,
  executor: CombatExecutor,
): boolean {
  return executor.elapsed >= getNextAttackTime(entity, state);
}
