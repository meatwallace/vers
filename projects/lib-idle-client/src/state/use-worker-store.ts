import { create } from 'zustand';

interface WorkerStore {
  worker: null | SharedWorker;
}

export const useWorkerStore = create<WorkerStore>()(() => ({
  worker: null,
}));
