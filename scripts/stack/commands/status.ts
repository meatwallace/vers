import { execa } from '../../utils/execa.js';
import { DOCKER_COMPOSE_FILE } from '../consts.js';

export async function status(): Promise<void> {
  await execa`docker-compose -f ${DOCKER_COMPOSE_FILE} ps --all`;
}
