import { createServiceContext } from '../utils';
import { CreateServiceContextConfig } from '../utils/types';
import { createWorld } from './create-world';
import { generateWorldNames } from './generate-world-names';
import { getWorld } from './get-world';
import { getWorlds } from './get-worlds';
import { updateWorld } from './update-world';
import { deleteWorld } from './delete-world';
import {
  CreateWorldArgs,
  DeleteWorldArgs,
  GenerateWorldNamesArgs,
  GetWorldArgs,
  GetWorldsArgs,
  UpdateWorldArgs,
  WorldService,
} from './types';
type WorldServiceConfig = CreateServiceContextConfig;

export function createWorldService(config: WorldServiceConfig): WorldService {
  const ctx = createServiceContext(config);

  return {
    createWorld: async (args: CreateWorldArgs) => createWorld(args, ctx),
    deleteWorld: async (args: DeleteWorldArgs) => deleteWorld(args, ctx),
    getWorld: async (args: GetWorldArgs) => getWorld(args, ctx),
    getWorlds: async (args: GetWorldsArgs) => getWorlds(args, ctx),
    updateWorld: async (args: UpdateWorldArgs) => updateWorld(args, ctx),
    generateWorldNames: async (args: GenerateWorldNamesArgs) =>
      generateWorldNames(args, ctx),
  };
}
