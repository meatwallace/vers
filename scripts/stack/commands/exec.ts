import { ServiceID } from '@chrono/service-types';
import { execa } from '../../utils/execa.js';
import { DOCKER_COMPOSE_FILE } from '../consts.js';

export async function exec(
  service: ServiceID,
  command: string[],
): Promise<void> {
  await execa`docker-compose -f ${DOCKER_COMPOSE_FILE} exec ${service} ${command}`;
}
