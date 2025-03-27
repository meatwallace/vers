import { useWorkerStore } from './use-worker-store';

export function setWorker(worker: SharedWorker) {
  useWorkerStore.setState(() => ({ worker }));
}
