import { Character, EntityStatus } from '../../types';

export function handleReceiveCharacterDamage(
  amount: number,
  entity: Character,
): void {
  // prevent negative life
  const newLife = Math.max(entity.life - amount, 0);

  entity.setState((draftState) => {
    draftState.life = newLife;

    if (newLife <= 0) {
      draftState.status = EntityStatus.Dead;
    }
  });
}
