import { worlds } from '@chrononomicon/postgres-schema';
import { ServiceContext } from '../utils/types';

type World = typeof worlds.$inferSelect;

export type RawWorldData = {
  id: string;
  ownerID: string;
  name: string;
  fantasyType: World['fantasyType'];
  technologyLevel: World['technologyLevel'];
  archetype: World['archetype'];
  atmosphere: World['atmosphere'];
  population: World['population'];
  geographyType: World['geographyType'];
  geographyFeatures: World['geographyFeatures'];
  createdAt: string;
  updatedAt: string;
};

export type WorldServiceContext = ServiceContext;

export type WorldService = {
  getWorld: (args: GetWorldArgs) => Promise<typeof worlds.$inferSelect>;

  getWorlds: (
    args: GetWorldsArgs,
  ) => Promise<Array<typeof worlds.$inferSelect>>;

  createWorld: (args: CreateWorldArgs) => Promise<typeof worlds.$inferSelect>;

  deleteWorld: (args: DeleteWorldArgs) => Promise<true>;

  updateWorld: (args: UpdateWorldArgs) => Promise<typeof worlds.$inferSelect>;

  generateWorldNames: (args: GenerateWorldNamesArgs) => Promise<Array<string>>;
};

export type GetWorldArgs = {
  ownerID: string;
  worldID: string;
};

export type GetWorldsArgs = {
  ownerID: string;
};

export type CreateWorldArgs = {
  ownerID: string;
};

export type DeleteWorldArgs = {
  ownerID: string;
  worldID: string;
};

export type UpdateWorldArgs = {
  worldID: string;
  ownerID: string;
  name?: string;
  fantasyType?: World['fantasyType'];
  technologyLevel?: World['technologyLevel'];
  archetype?: World['archetype'];
  atmosphere?: World['atmosphere'];
  population?: World['population'];
  geographyType?: World['geographyType'];
  geographyFeatures?: World['geographyFeatures'];
};

export type GenerateWorldNamesArgs = {
  ownerID: string;
  worldID: string;
};
