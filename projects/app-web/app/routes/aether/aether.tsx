import type { CompressedAetherNode } from '@vers/aether-core';
import { Canvas } from '@react-three/fiber';
import { DevTools, NodeTooltip, Scene } from '@vers/aether-client';
import { setAetherGraph, setSelectedNode } from '@vers/aether-client';
import { decompressAetherNodes } from '@vers/aether-core';
import { aetherNodes } from '@vers/data';
import * as styles from './route.styles.ts';
import { SelectedNodeInfo } from './selected-node-info.tsx';

const aetherGraph = decompressAetherNodes(
  aetherNodes as Array<CompressedAetherNode>,
);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const firstNode = Object.values(aetherGraph.nodes)[0]!;

setAetherGraph(aetherGraph);
setSelectedNode(firstNode, null);

export function Aether() {
  return (
    <>
      <Canvas>
        <Scene />
      </Canvas>
      <NodeTooltip className={styles.tooltip} />
      <SelectedNodeInfo className={styles.selectedNodeInfo} />
      {import.meta.env.DEV && <DevTools />}
    </>
  );
}
