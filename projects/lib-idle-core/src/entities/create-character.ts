import { produce } from 'immer';
import type {
  BehaviourID,
  Character,
  CharacterAppState,
  CharacterBehaviour,
  CharacterBehaviourAppState,
  CharacterData,
  CharacterState,
  CombatExecutor,
  SetEntityStateFn,
  SimulationContext,
} from '../types';
import { createPlayerWeaponAttackBehaviour } from '../behaviours/character-weapon-attack';
import {
  EntityStatus,
  EntityType,
  EquipmentSlot,
  LifecycleEvent,
} from '../types';
import { createLogLabel } from '../utils/create-log-label';
import { logger } from '../utils/logger';
import { calcCharacterAttackDamage } from './utils/calc-character-attack-damage';
import { handleReceiveCharacterDamage } from './utils/handle-receive-character-damage';

const DEFAULT_BEHAVIOUR_FACTORIES = [createPlayerWeaponAttackBehaviour];

interface ResetConfig {
  soft?: boolean;
}

export function createCharacter(
  data: CharacterData,
  ctx: SimulationContext,
): Character {
  const label = createLogLabel('character', data.id);

  let state = getInitialState(data);

  // TODO: pull this out into a util
  const getAppState = (): CharacterAppState => {
    const behaviourState: CharacterBehaviourAppState = {};

    for (const behaviour of behaviours) {
      addBehaviourState(behaviourState, behaviour.id, behaviour.getState());
    }

    const mainHandWeapon = data.paperdoll[EquipmentSlot.MainHand];

    const mainHandAttack = mainHandWeapon
      ? {
          maxDamage: mainHandWeapon.maxDamage,
          minDamage: mainHandWeapon.minDamage,
          speed: mainHandWeapon.speed,
        }
      : null;

    return {
      ...state,
      behaviours: behaviourState,
      id: data.id,
      image: data.image,
      isAlive: state.status === EntityStatus.Alive,
      level: data.level,
      mainHandAttack,
      name: data.name,
    };
  };

  const setState = (setStateFn: SetEntityStateFn<CharacterState>): void => {
    const nextState = produce(state, setStateFn);

    state = { ...nextState };
  };

  let behaviours: Array<CharacterBehaviour> = [];

  const handleTick = (combatExecutor: CombatExecutor): void => {
    for (const behaviour of behaviours) {
      const handler = behaviour.handlers[LifecycleEvent.OnTick];

      handler?.(character, combatExecutor, ctx);
    }
  };

  const addBehaviour = (behaviour: CharacterBehaviour): void => {
    behaviours.push(behaviour);
  };

  const removeBehaviour = (id: BehaviourID): void => {
    behaviours = behaviours.filter((behaviour) => behaviour.id !== id);
  };

  const reset = (config: ResetConfig = {}): void => {
    if (!config.soft) {
      state = getInitialState(data);
    }

    for (const behaviour of behaviours) {
      const handler = behaviour.handlers[LifecycleEvent.Reset];

      handler?.(character, ctx);
    }
  };

  const character: Character = {
    // meta
    id: data.id,
    level: data.level,
    type: EntityType.Character,

    // getters
    get isAlive() {
      return state.status === EntityStatus.Alive;
    },
    get life() {
      return state.life;
    },
    get mainHandEquipment() {
      return data.paperdoll[EquipmentSlot.MainHand];
    },
    get status() {
      return state.status;
    },

    // core
    addBehaviour,
    getAppState,
    handleTick,
    removeBehaviour,
    setState,

    // utils
    calcAttackDamage: () => calcCharacterAttackDamage(character, ctx),
    receiveDamage: (amount: number) => {
      handleReceiveCharacterDamage(amount, character);

      logger.debug(
        `${label} <-- ${amount} damage (${state.life} life remains)`,
      );
    },
    reset,
  };

  DEFAULT_BEHAVIOUR_FACTORIES
    // create behaviours & register them if they're applicable
    .map((createBehaviour) => createBehaviour(character))
    .filter((behaviour) => behaviour.predicate(character))
    .map((behaviour) => addBehaviour(behaviour));

  return character;
}

export function getInitialState(data: CharacterData): CharacterState {
  return {
    life: data.life,
    maxLife: data.life,
    status: EntityStatus.Alive,
  };
}

// type safe util for adding our behaviour state to our serializable state
function addBehaviourState<K extends BehaviourID>(
  state: CharacterBehaviourAppState,
  id: K,
  value: CharacterBehaviourAppState[K],
): void {
  state[id] = value;
}
