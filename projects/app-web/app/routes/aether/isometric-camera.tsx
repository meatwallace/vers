import { useCallback } from 'react';
import type {
  Object3D,
  PerspectiveCamera as PerspectiveCameraImpl,
} from 'three';
import { animated, config, useSpring } from '@react-spring/three';
import { PerspectiveCamera, useHelper } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { CameraHelper, Euler } from 'three';
import {
  CAMERA_DISTANCE,
  CAMERA_ROTATION_X,
  CAMERA_ROTATION_Y,
  ISOMETRIC_OFFSET_X,
  ISOMETRIC_OFFSET_Z,
} from './consts';
import { setCamera } from './set-camera';
import { useCamera } from './use-camera';
import { useIsDevCameraActive } from './use-is-dev-camera-active';
import { useSelectedNode } from './use-selected-node';

const ISOMETRIC_CAMERA_ROTATION = new Euler(
  CAMERA_ROTATION_X,
  CAMERA_ROTATION_Y,
  0,
  'YXZ',
);

const AnimatedPerspectiveCamera = animated(PerspectiveCamera);

/**
 * this component is a big liar. it used to be an orthographic camera configured
 * for an isometric view, but now it's just a perspective camera with the same fixed
 * height and rotation. with out current Aether layout, isometric looks awful.
 */
export function IsometricCamera() {
  const camera = useCamera();
  const canvasSize = useThree((state) => state.size);
  const isDevCameraActive = useIsDevCameraActive();
  const { object3D } = useSelectedNode();

  const spring = useSpring({
    config: {
      ...config.gentle,
      clamp: true,
      precision: 0.001,
    },
    position: getNodeCameraPosition(object3D),
  });

  const setCameraRef = useCallback(
    (cameraInstance: null | PerspectiveCameraImpl) => {
      if (!cameraInstance) {
        return;
      }

      setCamera(cameraInstance);
    },
    [],
  );

  // @ts-expect-error - can't make ref types work with useHelper for the life of me
  useHelper(import.meta.env.DEV && camera, CameraHelper);

  // force our isometric camera rotation and height unless we're using our dev camera
  useFrame(() => {
    if (!camera) {
      return;
    }

    camera.rotation.copy(ISOMETRIC_CAMERA_ROTATION);
    camera.position.y = CAMERA_DISTANCE;
    camera.updateProjectionMatrix();
  });

  const aspect = canvasSize.width / canvasSize.height;

  return (
    <AnimatedPerspectiveCamera
      ref={setCameraRef}
      args={[75, aspect, 0.1, 1000]}
      makeDefault={!isDevCameraActive}
      // @ts-expect-error - issue with react-spring's types
      position={spring.position}
      rotation={ISOMETRIC_CAMERA_ROTATION}
    />
  );
}

// keeping this for a rainy day
// <OrthographicCamera
//   ref={cameraRef}
//   args={[
//     -CAMERA_DISTANCE * aspect,
//     CAMERA_DISTANCE * aspect,
//     CAMERA_DISTANCE,
//     -CAMERA_DISTANCE,
//     1,
//     1000,
//   ]}
//   makeDefault={!isDevCameraActive}
//   zoom={10}
// />

/**
 * get the camera position we want to animate to for a given node
 * @param node - the node to get the camera position for
 * @returns the camera position
 */
function getNodeCameraPosition(node: null | Object3D) {
  if (!node) {
    return [0, CAMERA_DISTANCE, 0];
  }

  return [
    node.position.x + ISOMETRIC_OFFSET_X,
    CAMERA_DISTANCE,
    -(node.position.y - ISOMETRIC_OFFSET_Z),
  ];
}
