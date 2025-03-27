import { useWorkerStore } from './use-worker-store';

export function useWorker() {
  const worker = useWorkerStore((state) => state.worker);

  return worker;
}
