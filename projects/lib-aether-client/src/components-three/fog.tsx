import { useIsDevCameraActive } from '../state/use-is-dev-camera-active';

export function Fog() {
  const isDevCameraActive = useIsDevCameraActive();

  if (isDevCameraActive) {
    return null;
  }

  return <fog args={[0x000000, 20, 200]} attach="fog" />;
}
