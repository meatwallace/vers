import type {
  Character,
  CombatExecutor,
  PlayerWeaponAttackBehaviourState,
} from '../../types';
import { getNextAttackTime } from './get-next-attack-time';

export function isAttackReady(
  entity: Character,
  state: PlayerWeaponAttackBehaviourState,
  executor: CombatExecutor,
): boolean {
  if (!entity.isAlive) {
    return false;
  }

  return executor.elapsed >= getNextAttackTime(entity, state);
}
