import type { Character, SimulationContext } from '~/types';

export function calcCharacterAttackDamage(
  character: Character,
  ctx: SimulationContext,
): number {
  if (!character.mainHandEquipment) {
    return 0;
  }

  return ctx.rng.getInt(
    character.mainHandEquipment.minDamage,
    character.mainHandEquipment.maxDamage,
  );
}
