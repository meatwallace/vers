import { createId } from '@paralleldrive/cuid2';
import type {
  ActivityExecutor,
  AttackData,
  CombatExecutor,
  Enemy,
  EnemyData,
  HandleTickFn,
} from '~/types';
import { createPrimaryAttackHandler } from '~/behaviours/create-primary-attack-handler';
import { EntityStatus, EntityType } from '~/types';
import { logger } from '~/utils/logger';

export function createEnemy(
  data: EnemyData,
  executor: ActivityExecutor,
): Enemy {
  const id = createId();

  let life = data.life;
  let status = EntityStatus.Alive;

  const label = `[enemy:${id}]`;

  const getAttackInfo = (): AttackData => {
    return data.primaryAttack;
  };

  const getAttackDamage = (): number => {
    const attackInfo = getAttackInfo();

    return executor.rng.getInt(attackInfo.minDamage, attackInfo.maxDamage);
  };

  const receiveDamage = (amount: number): void => {
    life -= amount;

    logger.debug(`${label} received ${amount} damage -> ${life} life remains`);

    if (life <= 0) {
      setStatus(EntityStatus.Dead);
    }
  };

  const setStatus = (nextStatus: EntityStatus): void => {
    logger.debug(`${label} setting status to ${nextStatus}`);

    status = nextStatus;
  };

  const handlers: Array<HandleTickFn> = [];

  const handleTick = (combatExecutor: CombatExecutor): void => {
    for (const handler of handlers) {
      handler(combatExecutor);
    }
  };

  const enemy = {
    // meta
    id,
    level: data.level,
    type: EntityType.Enemy,

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
  } satisfies Enemy;

  // handlers will be dynamically assigned based on conditions later but we'll
  // manually attach this for now
  const handlePrimaryAttack = createPrimaryAttackHandler(enemy);

  handlers.push(handlePrimaryAttack);

  return enemy;
}
