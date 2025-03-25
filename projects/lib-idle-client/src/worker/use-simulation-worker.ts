import { useEffect, useRef } from 'react';
import type {
  InitialStateMessage,
  SimulationUpdateMessage,
  WorkerMessage,
} from '../types.ts';
import { setActivity } from '../state/set-activity.ts';
import { setCharacter } from '../state/set-character.ts';
import { setCombat } from '../state/set-combat.ts';
import { WorkerMessageType } from '../types.ts';
import SimulationWorker from './worker.ts?sharedworker';

export function useSimulationWorker() {
  const workerRef = useRef<null | SharedWorker>(null);

  useEffect(() => {
    const worker = new SimulationWorker();

    workerRef.current = worker;

    // eslint-disable-next-line unicorn/prefer-add-event-listener
    worker.port.onmessage = handleWorkerMessage;

    return () => {
      worker.port.close();
    };
  }, []);

  return workerRef.current;
}

function handleWorkerMessage(event: MessageEvent<WorkerMessage>) {
  if (isInitialStateMessage(event.data) || isUpdateMessage(event.data)) {
    setCharacter(event.data.state.character);
    setActivity(event.data.state.activity);
    setCombat(event.data.state.combat);
  }
}

function isInitialStateMessage(
  message: WorkerMessage,
): message is InitialStateMessage {
  return message.type === WorkerMessageType.InitialState;
}

function isUpdateMessage(
  message: WorkerMessage,
): message is SimulationUpdateMessage {
  return message.type === WorkerMessageType.SimulationUpdate;
}
