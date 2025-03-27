import { BufferGeometry } from 'three';
import type { AetherEdge } from './types';
import { getScenePosition } from './get-scene-position';

interface AetherEdgeProps {
  edge: AetherEdge;
}

export function AetherEdge(props: AetherEdgeProps) {
  const points = [
    getScenePosition(props.edge.start),
    getScenePosition(props.edge.end),
  ];

  const lineGeometry = new BufferGeometry().setFromPoints(points);

  return (
    // @ts-expect-error - this should map to the THREE.Line type, not the SVG line element
    <line geometry={lineGeometry}>
      <lineBasicMaterial color={0xaaaaaa} />
    </line>
  );
}
