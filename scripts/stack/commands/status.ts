import { execa } from '../../utils/execa.ts';
import { DOCKER_COMPOSE_FILE } from '../consts.ts';

export async function status(): Promise<void> {
  await execa`docker-compose -f ${DOCKER_COMPOSE_FILE} ps --all`;
}
