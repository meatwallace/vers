import { useIsDevCameraActive } from './use-is-dev-camera-active';

export function Fog() {
  const isDevCameraActive = useIsDevCameraActive();

  if (isDevCameraActive) {
    return null;
  }

  return <fog args={[0x000000, 30, 200]} attach="fog" />;
}
