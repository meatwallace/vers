import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const DOCKER_COMPOSE_FILE = path.resolve(
  __dirname,
  '../../../docker-compose.yml',
);
