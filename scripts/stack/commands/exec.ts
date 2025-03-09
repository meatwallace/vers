import { ServiceID } from '@chrono/service-types';
import { execa } from '../../utils/execa.ts';
import { DOCKER_COMPOSE_FILE } from '../consts.ts';

export async function exec(
  service: ServiceID,
  command: Array<string>,
): Promise<void> {
  await execa`docker-compose -f ${DOCKER_COMPOSE_FILE} exec ${service} ${command}`;
}
