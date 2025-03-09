import {
  CreateWorldRequest,
  DeleteWorldRequest,
  GenerateWorldNamesRequest,
  GetWorldRequest,
  GetWorldsRequest,
  UpdateWorldRequest,
} from '@chrono/service-types';
import { createServiceContext } from '../utils';
import { CreateServiceContextConfig } from '../utils/types';
import { createWorld } from './create-world';
import { deleteWorld } from './delete-world';
import { generateWorldNames } from './generate-world-names';
import { getWorld } from './get-world';
import { getWorlds } from './get-worlds';
import { WorldService } from './types';
import { updateWorld } from './update-world';

type WorldServiceConfig = CreateServiceContextConfig;
export function createWorldService(config: WorldServiceConfig): WorldService {
  const ctx = createServiceContext(config);

  return {
    createWorld: async (args: CreateWorldRequest) => createWorld(args, ctx),

    deleteWorld: async (args: DeleteWorldRequest) => deleteWorld(args, ctx),

    generateWorldNames: async (args: GenerateWorldNamesRequest) =>
      generateWorldNames(args, ctx),

    getWorld: async (args: GetWorldRequest) => getWorld(args, ctx),

    getWorlds: async (args: GetWorldsRequest) => getWorlds(args, ctx),

    updateWorld: async (args: UpdateWorldRequest) => updateWorld(args, ctx),
  };
}
