import type { Character } from '../../types';

export function predicate(entity: Character): boolean {
  // TODO: verify main hand is actually a weapon
  return entity.mainHandEquipment !== null;
}
