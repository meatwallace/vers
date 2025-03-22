import { createId } from '@paralleldrive/cuid2';
import { logger } from '~/utils/logger';
import type {
  AttackEvent,
  CombatExecutor,
  Entity,
  HandleTickFn,
} from '../types';
import { CombatEventType, EntityType } from '../types';

const ENTITY_ATTACK_EVENT_TYPE: Record<EntityType, CombatEventType> = {
  [EntityType.Enemy]: CombatEventType.EnemyAttack,
  [EntityType.PlayerCharacter]: CombatEventType.PlayerAttack,
} as const;

export function createPrimaryAttackHandler(entity: Entity): HandleTickFn {
  // internal state
  let lastAttackTime = 0;

  // getters
  const getNextAttackTime = (): number => {
    return lastAttackTime + getAttackIntervalMS();
  };

  const getAttackIntervalMS = (): number => {
    return 1000 / entity.attack.speed;
  };

  // setters
  const setLastAttackTime = (time: number): void => {
    lastAttackTime = time;
  };

  // utils
  const isAttackReady = (executor: CombatExecutor): boolean => {
    return executor.elapsed > getNextAttackTime();
  };

  const attackEventType = ENTITY_ATTACK_EVENT_TYPE[entity.type];

  const createAttackEvent = (executor: CombatExecutor): AttackEvent => {
    const event = {
      id: createId(),
      source: entity.id,
      time: getNextAttackTime(),
      type: attackEventType,
    } satisfies AttackEvent;

    setLastAttackTime(executor.elapsed);

    return event;
  };

  // handlers
  const processPrimaryAttack = (executor: CombatExecutor): void => {
    if (isAttackReady(executor)) {
      const event = createAttackEvent(executor);

      logger.debug(`[primary-attack] scheduling event at ${event.time}`);

      executor.scheduleEvent(event);
    }
  };

  return processPrimaryAttack;
}
