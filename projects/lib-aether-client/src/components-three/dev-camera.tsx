import { PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useIsDevCameraActive } from '../state/use-is-dev-camera-active';
import { CameraControls } from './camera-controls';

export function DevCamera() {
  const canvasSize = useThree((state) => state.size);
  const isDevCameraActive = useIsDevCameraActive();

  const aspect = canvasSize.width / canvasSize.height;

  if (!isDevCameraActive) {
    return null;
  }

  return (
    <>
      <CameraControls />
      <PerspectiveCamera
        args={[75, aspect, 0.1, 1000]}
        makeDefault={isDevCameraActive}
        position={[0, 500, -500]}
        rotation={[-Math.PI / 4, 0, 0]}
      />
    </>
  );
}
