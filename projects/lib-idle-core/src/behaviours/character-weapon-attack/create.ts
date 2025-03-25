import { produce } from 'immer';
import type {
  Character,
  CombatExecutor,
  PlayerWeaponAttackBehaviour,
  PlayerWeaponAttackBehaviourState,
  SetEntityStateFn,
} from '../../types';
import { BehaviourID, LifecycleEvent } from '../../types';
import { getInitialState } from './get-initial-state';
import { getNextAttackTime } from './get-next-attack-time';
import { handleTick } from './handle-tick';
import { predicate } from './predicate';

export function create(entity: Character): PlayerWeaponAttackBehaviour {
  let state = getInitialState();

  const getState = (): PlayerWeaponAttackBehaviourState => state;

  const setState = (
    setStateFn: SetEntityStateFn<PlayerWeaponAttackBehaviourState>,
  ): void => {
    state = produce(state, setStateFn);
  };

  const handleReset = (): void => {
    state = getInitialState();
  };

  const behaviour: PlayerWeaponAttackBehaviour = {
    // meta
    id: BehaviourID.PlayerWeaponAttack,

    // getters
    get lastAttackTime(): number {
      return state.lastAttackTime;
    },
    get nextAttackTime(): number {
      return getNextAttackTime(entity, state);
    },
    get state(): PlayerWeaponAttackBehaviourState {
      return state;
    },

    // handlers
    handlers: {
      [LifecycleEvent.OnTick]: (entity: Character, executor: CombatExecutor) =>
        handleTick(entity, behaviour, executor),
      [LifecycleEvent.Reset]: () => handleReset(),
    },
    predicate,

    // utils
    getState,
    setState,
  };

  return behaviour;
}
