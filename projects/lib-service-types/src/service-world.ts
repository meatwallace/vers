import * as schema from '@chrono/postgres-schema';
import { ServiceResponse } from './service-response';

export interface CreateWorldRequest {
  ownerID: string;
}

export type CreateWorldResponse = ServiceResponse<{
  archetype: null | string;
  atmosphere: string;
  createdAt: Date;
  fantasyType: string;
  geographyFeatures: Array<string>;
  geographyType: string;
  id: string;
  name: string;
  ownerID: string;
  population: string;
  technologyLevel: string;
  updatedAt: Date;
}>;

type World = typeof schema.worlds.$inferSelect;

export interface UpdateWorldRequest {
  archetype?: World['archetype'];
  atmosphere?: World['atmosphere'];
  fantasyType?: World['fantasyType'];
  geographyFeatures?: World['geographyFeatures'];
  geographyType?: World['geographyType'];
  name?: string;
  ownerID: string;
  population?: World['population'];
  technologyLevel?: World['technologyLevel'];
  worldID: string;
}

export type UpdateWorldResponse = ServiceResponse<{
  archetype: World['archetype'];
  atmosphere: World['atmosphere'];
  createdAt: Date;
  fantasyType: World['fantasyType'];
  geographyFeatures: World['geographyFeatures'];
  geographyType: World['geographyType'];
  id: string;
  name: string;
  ownerID: string;
  population: World['population'];
  technologyLevel: World['technologyLevel'];
  updatedAt: Date;
}>;

export interface DeleteWorldRequest {
  ownerID: string;
  worldID: string;
}

export type DeleteWorldResponse = ServiceResponse<{
  deletedID: string;
}>;

export interface GetWorldRequest {
  ownerID: string;
  worldID: string;
}

export type GetWorldResponse = ServiceResponse<null | {
  archetype: World['archetype'];
  atmosphere: World['atmosphere'];
  createdAt: Date;
  fantasyType: World['fantasyType'];
  geographyFeatures: World['geographyFeatures'];
  geographyType: World['geographyType'];
  id: string;
  name: string;
  ownerID: string;
  population: World['population'];
  technologyLevel: World['technologyLevel'];
  updatedAt: Date;
}>;

export interface GetWorldsRequest {
  ownerID: string;
}

export type GetWorldsResponse = ServiceResponse<
  Array<{
    archetype: World['archetype'];
    atmosphere: World['atmosphere'];
    createdAt: Date;
    fantasyType: World['fantasyType'];
    geographyFeatures: World['geographyFeatures'];
    geographyType: World['geographyType'];
    id: string;
    name: string;
    ownerID: string;
    population: World['population'];
    technologyLevel: World['technologyLevel'];
    updatedAt: Date;
  }>
>;

export interface GenerateWorldNamesRequest {
  ownerID: string;
  worldID: string;
}

export type GenerateWorldNamesResponse = ServiceResponse<Array<string>>;
