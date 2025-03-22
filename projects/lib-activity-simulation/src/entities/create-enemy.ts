import { createId } from '@paralleldrive/cuid2';
import { produce } from 'immer';
import type {
  BehaviourID,
  CombatExecutor,
  Enemy,
  EnemyData,
  EnemyState,
  IBehaviour,
  SetEntityStateFn,
  SimulationContext,
} from '~/types';
import { createEnemyPrimaryAttackBehaviour } from '~/behaviours/enemy-primary-attack';
import { EntityStatus, EntityType, LifecycleEvent } from '~/types';
import { createLogLabel } from '~/utils/create-log-label';
import { logger } from '~/utils/logger';
import { calcEnemyAttackDamage } from './utils/calc-enemy-attack-damage';
import { handleReceiveEnemyDamage } from './utils/handle-receive-enemy-damage';

const DEFAULT_BEHAVIOUR_FACTORIES = [createEnemyPrimaryAttackBehaviour];

function getInitialState(data: EnemyData): EnemyState {
  return {
    life: data.life,
    status: EntityStatus.Alive,
  };
}

export function createEnemy(data: EnemyData, ctx: SimulationContext): Enemy {
  const id = createId();
  const label = createLogLabel('enemy', id);

  let state = getInitialState(data);

  const getState = (): EnemyState => {
    return state;
  };

  const setState = (setStateFn: SetEntityStateFn<EnemyState>): void => {
    const nextState = produce(state, setStateFn);

    state = { ...nextState };
  };

  let behaviours: Array<IBehaviour<Enemy>> = [];

  const handleTick = (combatExecutor: CombatExecutor): void => {
    for (const behaviour of behaviours) {
      const handler = behaviour.handlers[LifecycleEvent.OnTick];

      handler?.(enemy, combatExecutor, ctx);
    }
  };

  const addBehaviour = (behaviour: IBehaviour<Enemy>): void => {
    behaviours.push(behaviour);
  };

  const removeBehaviour = (id: BehaviourID): void => {
    behaviours = behaviours.filter((behaviour) => behaviour.id !== id);
  };

  const enemy: Enemy = {
    // meta
    id,
    level: data.level,
    name: data.name,
    type: EntityType.Enemy,

    // getters
    get isAlive() {
      return state.status === EntityStatus.Alive;
    },
    get life() {
      return state.life;
    },
    get primaryAttack() {
      return data.primaryAttack;
    },
    get status() {
      return state.status;
    },

    // core
    addBehaviour,
    getState,
    handleTick,
    removeBehaviour,
    setState,

    // utils
    calcAttackDamage: () => calcEnemyAttackDamage(enemy, ctx),
    receiveDamage: (amount: number) => {
      handleReceiveEnemyDamage(amount, enemy);

      logger.debug(
        `${label} <-- ${amount} damage (${state.life} life remains)`,
      );
    },
  };

  DEFAULT_BEHAVIOUR_FACTORIES
    // create behaviours & register them if they're applicable
    .map((createBehaviour) => createBehaviour(enemy))
    .filter((behaviour) => behaviour.predicate(enemy))
    .map((behaviour) => addBehaviour(behaviour));

  return enemy;
}
