import { OrbitControls } from '@react-three/drei';

export function CameraControls() {
  return <OrbitControls maxZoom={30} minZoom={10} />;
}
