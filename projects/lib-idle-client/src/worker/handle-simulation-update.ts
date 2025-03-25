import invariant from 'tiny-invariant';
import { connections } from './connections';
import { createSimulationUpdateMessage } from './create-simulation-update-message';
import { getSimulation } from './simulation';

export function handleSimulationUpdate() {
  const simulation = getSimulation();

  invariant(simulation, 'simulation is required');

  for (const connection of connections) {
    const message = createSimulationUpdateMessage(simulation.getAppState());

    connection.postMessage(message);
  }
}
