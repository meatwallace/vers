import { useShallow } from 'zustand/react/shallow';
import { useSelectedNodeStore } from './use-selected-node-store';

export function useSelectedNode() {
  const selectedNode = useSelectedNodeStore(
    useShallow((state) => ({
      node: state.node,
      object3D: state.object3D,
    })),
  );

  return selectedNode;
}
