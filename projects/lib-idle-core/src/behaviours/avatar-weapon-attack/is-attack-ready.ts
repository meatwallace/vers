import type {
  Avatar,
  CombatExecutor,
  PlayerWeaponAttackBehaviourState,
} from '../../types';
import { getNextAttackTime } from './get-next-attack-time';

export function isAttackReady(
  entity: Avatar,
  state: PlayerWeaponAttackBehaviourState,
  executor: CombatExecutor,
): boolean {
  if (!entity.isAlive) {
    return false;
  }

  return executor.elapsed >= getNextAttackTime(entity, state);
}
