import type { SerializableSimulationState, SimulationState } from '~/types';

export function getSerializableState(
  state: SimulationState,
): SerializableSimulationState {
  const activity = state.activity?.getState();
  const character = state.character.getState();

  return {
    activity,
    character,
  };
}
