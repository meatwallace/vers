import invariant from 'tiny-invariant';
import type { SetActivityMessage } from '../types';
import { getSimulation } from './simulation';

export function handleSetActivityMessage(message: SetActivityMessage) {
  const simulation = getSimulation();

  invariant(simulation, 'simulation is required');

  simulation.startActivity(message.activity);
}
