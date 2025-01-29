import { WorldData } from '~/services/world-service/types';
import { builder } from '../builder';

export const World = builder.objectRef<WorldData>('World');

World.implement({
  fields: (t) => ({
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    fantasyType: t.exposeString('fantasyType'),
    technologyLevel: t.exposeString('technologyLevel'),
    archetype: t.exposeString('archetype', { nullable: true }),
    atmosphere: t.exposeString('atmosphere'),
    population: t.exposeString('population'),
    geographyType: t.exposeString('geographyType'),
    geographyFeatures: t.exposeStringList('geographyFeatures'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});
