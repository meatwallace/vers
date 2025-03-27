import type { CompressedAetherGraphData } from '@vers/aether-core';
import { Canvas } from '@react-three/fiber';
import { aetherGraph } from '@vers/aether-core';
import { DevTools } from './dev-tools';
import { getAetherEdgeMap } from './get-aether-edge-map';
import { getAetherNodeMap } from './get-aether-node-map';
import { NodeTooltip } from './node-tooltip';
import * as styles from './route.styles.ts';
import { Scene } from './scene';
import { SelectedNodeInfo } from './selected-node-info';
import { setAetherGraph } from './set-aether-graph';
import { setSelectedNode } from './set-selected-node.ts';

const aetherNodes = getAetherNodeMap(aetherGraph as CompressedAetherGraphData);
const aetherEdges = getAetherEdgeMap(aetherNodes);

setAetherGraph(aetherNodes, aetherEdges);

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const firstNode = Object.values(aetherNodes)[0]!;

setSelectedNode(firstNode, null);

export function Aether() {
  return (
    <div className={styles.container}>
      <Canvas>
        <Scene />
      </Canvas>
      <NodeTooltip />
      <SelectedNodeInfo />
      {import.meta.env.DEV && <DevTools />}
    </div>
  );
}

export default Aether;
