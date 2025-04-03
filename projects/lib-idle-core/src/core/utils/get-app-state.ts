import type { SimulationAppState, SimulationState } from '../../types';

export function getAppState(state: SimulationState): SimulationAppState {
  const combat = state.combat?.getAppState();
  const activity = state.activity?.getAppState();
  const avatar = state.avatar?.getAppState();

  return {
    activity,
    avatar,
    combat,
  };
}
