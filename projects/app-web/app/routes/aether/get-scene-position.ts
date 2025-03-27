import { Vector3 } from 'three';
import { NODE_POSITION_SCALING_FACTOR } from './consts';

/**
 * convert a given x,y position to a Vector3
 */
export function getScenePosition(position: [number, number]): Vector3 {
  const x = position[0] * NODE_POSITION_SCALING_FACTOR;
  const y = position[1] * NODE_POSITION_SCALING_FACTOR;

  return new Vector3(x, y, 0);
}
