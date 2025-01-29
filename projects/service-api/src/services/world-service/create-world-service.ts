import { createServiceContext } from '../utils';
import { CreateServiceContextConfig } from '../utils/types';
import { createWorld } from './create-world';
import { generateWorldNames } from './generate-world-names';
import { getWorld } from './get-world';
import { getWorlds } from './get-worlds';
import { updateWorld } from './update-world';
import { deleteWorld } from './delete-world';
import { WorldService } from './types';
import {
  CreateWorldRequest,
  DeleteWorldRequest,
  GetWorldRequest,
  GetWorldsRequest,
  UpdateWorldRequest,
  GenerateWorldNamesRequest,
} from '@chrono/service-types';

type WorldServiceConfig = CreateServiceContextConfig;
export function createWorldService(config: WorldServiceConfig): WorldService {
  const ctx = createServiceContext(config);

  return {
    createWorld: async (args: CreateWorldRequest) => createWorld(args, ctx),

    deleteWorld: async (args: DeleteWorldRequest) => deleteWorld(args, ctx),

    getWorld: async (args: GetWorldRequest) => getWorld(args, ctx),

    getWorlds: async (args: GetWorldsRequest) => getWorlds(args, ctx),

    updateWorld: async (args: UpdateWorldRequest) => updateWorld(args, ctx),

    generateWorldNames: async (args: GenerateWorldNamesRequest) =>
      generateWorldNames(args, ctx),
  };
}
