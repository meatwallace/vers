import { ServiceID } from '@chrono/service-types';
import { execa } from '../../utils/execa.ts';
import { DOCKER_COMPOSE_FILE } from '../consts.ts';

export async function logs(service?: ServiceID): Promise<void> {
  const args = [];

  if (service) {
    args.push(service);
  }

  await execa`docker-compose -f ${DOCKER_COMPOSE_FILE} logs --tail=0 --follow ${args}`;
}
