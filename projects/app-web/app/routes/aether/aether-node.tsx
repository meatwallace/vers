import { useCallback } from 'react';
import type { AetherNode } from '@vers/aether-core';
import type { Mesh } from 'three';
import { ThreeEvent } from '@react-three/fiber';
import invariant from 'tiny-invariant';
import { getScenePosition } from './get-scene-position';
import { setHoveredNode } from './set-hovered-node';
import { setSelectedNode } from './set-selected-node';
import { useSelectedNode } from './use-selected-node';

interface AetherNodeProps {
  node: AetherNode;
}

const RADIUS = 0.5;
const NODE_SEGMENTS = 24;

export function AetherNode(props: AetherNodeProps) {
  const position = getScenePosition(props.node.position);
  const selectedNode = useSelectedNode();

  // if the node is selected but we're doing our initial render this is our opportunity
  // to grab a reference to the scene node
  const setSelectedNodeRef = useCallback(
    (object3D: Mesh | undefined) => {
      const isSelected = selectedNode.node?.id === props.node.id;
      const isInitialRender = !selectedNode.object3D && object3D;

      if (isSelected && isInitialRender) {
        setSelectedNode(props.node, object3D);
      }
    },
    [props.node, selectedNode.node?.id, selectedNode.object3D],
  );

  const handleClickNode = (event: ThreeEvent<PointerEvent>) => {
    invariant(selectedNode.node, 'selected node is required');

    // don't allow selecting a node unless it's connected to the selected node
    if (props.node.connections.includes(selectedNode.node.id)) {
      setSelectedNode(props.node, event.object);
    }
  };

  return (
    <mesh
      ref={setSelectedNodeRef}
      position={position}
      // its important we attach our node ID so we can look it up without selecting
      userData={{ id: props.node.id }}
      onPointerDown={(event) => handleClickNode(event)}
      onPointerEnter={() => setHoveredNode(props.node)}
      onPointerLeave={() => setHoveredNode(null)}
    >
      <circleGeometry args={[RADIUS, NODE_SEGMENTS]} />
      <meshStandardMaterial
        color={selectedNode.node?.id === props.node.id ? 'red' : 'white'}
      />
    </mesh>
  );
}
