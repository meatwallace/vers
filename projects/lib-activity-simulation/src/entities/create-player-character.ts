import type {
  ActivityExecutor,
  AttackData,
  CombatExecutor,
  HandleTickFn,
  PlayerCharacter,
  PlayerCharacterData,
} from '~/types';
import { createPrimaryAttackHandler } from '~/behaviours/create-primary-attack-handler';
import { EntityStatus, EntityType, EquipmentSlot } from '~/types';
import { logger } from '~/utils/logger';

export function createPlayerCharacter(
  data: PlayerCharacterData,
  executor: ActivityExecutor,
): PlayerCharacter {
  let life = data.life;
  let status = EntityStatus.Alive;

  const getAttackInfo = (): AttackData => {
    const weapon = data.paperdoll[EquipmentSlot.TwoHandedWeapon];

    return {
      maxDamage: weapon.maxDamage,
      minDamage: weapon.minDamage,
      speed: weapon.speed,
    };
  };

  const getAttackDamage = (): number => {
    const attackInfo = getAttackInfo();

    return executor.rng.getInt(attackInfo.minDamage, attackInfo.maxDamage);
  };

  const receiveDamage = (amount: number): void => {
    life -= amount;

    logger.debug(`[player] received ${amount} damage -> ${life} life remains`);

    if (life <= 0) {
      setStatus(EntityStatus.Dead);
    }
  };

  const setStatus = (nextStatus: EntityStatus): void => {
    logger.debug(`[player] setting status to ${nextStatus}`);

    status = nextStatus;
  };

  const handlers: Array<HandleTickFn> = [];

  const handleTick = (combatExecutor: CombatExecutor): void => {
    for (const handler of handlers) {
      handler(combatExecutor);
    }
  };

  const character = {
    // meta
    id: data.id,
    level: data.level,
    type: EntityType.PlayerCharacter,

    // getters
    get attack() {
      return getAttackInfo();
    },
    get isAlive() {
      return status === EntityStatus.Alive;
    },
    get life() {
      return life;
    },
    get status() {
      return status;
    },

    // core
    handleTick,

    // utils
    getAttackDamage,
    receiveDamage,
  } satisfies PlayerCharacter;

  // handlers will be dynamically assigned based on conditions later but we'll
  // manually attach this for now
  const handlePrimaryAttack = createPrimaryAttackHandler(character);

  handlers.push(handlePrimaryAttack);

  return character;
}
