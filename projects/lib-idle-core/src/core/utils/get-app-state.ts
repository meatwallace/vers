import type { SimulationAppState, SimulationState } from '../../types';

export function getAppState(state: SimulationState): SimulationAppState {
  const combat = state.combat?.getAppState();
  const activity = state.activity?.getAppState();
  const character = state.character.getAppState();

  return {
    activity,
    character,
    combat,
  };
}
