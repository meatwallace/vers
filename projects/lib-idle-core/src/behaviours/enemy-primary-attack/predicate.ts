import type { Enemy } from '../../types';

export function predicate(entity: Enemy): boolean {
  return !!entity.primaryAttack;
}
