import { worlds } from '@chrono/postgres-schema';
import { ServiceContext } from '../utils/types';
import {
  GetWorldRequest,
  GetWorldsRequest,
  CreateWorldRequest,
  DeleteWorldRequest,
  UpdateWorldRequest,
  GenerateWorldNamesRequest,
} from '@chrono/service-types';

type World = typeof worlds.$inferSelect;

export type WorldData = World;

export interface RawWorldData {
  id: string;
  ownerID: string;
  name: string;
  fantasyType: string;
  technologyLevel: World['technologyLevel'];
  archetype: World['archetype'];
  atmosphere: World['atmosphere'];
  population: World['population'];
  geographyType: World['geographyType'];
  geographyFeatures: World['geographyFeatures'];
  createdAt: string;
  updatedAt: string;
}

export type WorldServiceContext = ServiceContext;

export interface WorldService {
  getWorld: (args: GetWorldRequest) => Promise<WorldData | null>;

  getWorlds: (args: GetWorldsRequest) => Promise<Array<WorldData>>;

  createWorld: (args: CreateWorldRequest) => Promise<WorldData>;

  deleteWorld: (args: DeleteWorldRequest) => Promise<true>;

  updateWorld: (args: UpdateWorldRequest) => Promise<WorldData>;

  generateWorldNames: (
    args: GenerateWorldNamesRequest,
  ) => Promise<Array<string>>;
}
