import { ServiceID } from '@chrono/service-types';
import { DOCKER_COMPOSE_FILE } from '../consts.js';
import { execa } from '../../utils/execa.js';

export async function stop(service?: ServiceID): Promise<void> {
  const args = [];

  if (service) {
    args.push(service);
  }

  await execa`docker-compose -f ${DOCKER_COMPOSE_FILE} stop ${args}`;
}
