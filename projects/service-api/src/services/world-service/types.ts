import { worlds } from '@chrono/postgres-schema';
import {
  CreateWorldRequest,
  DeleteWorldRequest,
  GenerateWorldNamesRequest,
  GetWorldRequest,
  GetWorldsRequest,
  UpdateWorldRequest,
} from '@chrono/service-types';
import { ServiceContext } from '../utils/types';

type World = typeof worlds.$inferSelect;

export type WorldData = World;

export interface RawWorldData {
  archetype: World['archetype'];
  atmosphere: World['atmosphere'];
  createdAt: string;
  fantasyType: string;
  geographyFeatures: World['geographyFeatures'];
  geographyType: World['geographyType'];
  id: string;
  name: string;
  ownerID: string;
  population: World['population'];
  technologyLevel: World['technologyLevel'];
  updatedAt: string;
}

export type WorldServiceContext = ServiceContext;

export interface WorldService {
  createWorld: (args: CreateWorldRequest) => Promise<WorldData>;

  deleteWorld: (args: DeleteWorldRequest) => Promise<true>;

  generateWorldNames: (
    args: GenerateWorldNamesRequest,
  ) => Promise<Array<string>>;

  getWorld: (args: GetWorldRequest) => Promise<null | WorldData>;

  getWorlds: (args: GetWorldsRequest) => Promise<Array<WorldData>>;

  updateWorld: (args: UpdateWorldRequest) => Promise<WorldData>;
}
