import { Canvas } from '@react-three/fiber';
import {
  DevTools,
  NodeTooltip,
  Scene,
  SelectedNodeInfo,
} from '@vers/aether-client';
import * as styles from './route.styles.ts';

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
