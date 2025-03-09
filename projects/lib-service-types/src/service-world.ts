import * as schema from '@chrono/postgres-schema';
import { ServiceResponse } from './service-response';

export interface CreateWorldRequest {
  ownerID: string;
}

export type CreateWorldResponse = ServiceResponse<{
  id: string;
  ownerID: string;
  name: string;
  fantasyType: string;
  technologyLevel: string;
  archetype: string | null;
  atmosphere: string;
  population: string;
  geographyType: string;
  geographyFeatures: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}>;

type World = typeof schema.worlds.$inferSelect;

export interface UpdateWorldRequest {
  ownerID: string;
  worldID: string;
  name?: string;
  fantasyType?: World['fantasyType'];
  technologyLevel?: World['technologyLevel'];
  archetype?: World['archetype'];
  atmosphere?: World['atmosphere'];
  population?: World['population'];
  geographyType?: World['geographyType'];
  geographyFeatures?: World['geographyFeatures'];
}

export type UpdateWorldResponse = ServiceResponse<{
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
  createdAt: Date;
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

export type GetWorldResponse = ServiceResponse<{
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
  createdAt: Date;
  updatedAt: Date;
} | null>;

export interface GetWorldsRequest {
  ownerID: string;
}

export type GetWorldsResponse = ServiceResponse<
  Array<{
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
    createdAt: Date;
    updatedAt: Date;
  }>
>;

export interface GenerateWorldNamesRequest {
  ownerID: string;
  worldID: string;
}

export type GenerateWorldNamesResponse = ServiceResponse<Array<string>>;
