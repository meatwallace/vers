import { WorldData } from '~/services/world-service/types';
import { builder } from '../builder';

export const World = builder.objectRef<WorldData>('World');

World.implement({
  fields: (t) => ({
    archetype: t.exposeString('archetype', { nullable: true }),
    atmosphere: t.exposeString('atmosphere'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    fantasyType: t.exposeString('fantasyType'),
    geographyFeatures: t.exposeStringList('geographyFeatures'),
    geographyType: t.exposeString('geographyType'),
    id: t.exposeID('id'),
    name: t.exposeString('name'),
    population: t.exposeString('population'),
    technologyLevel: t.exposeString('technologyLevel'),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
  }),
});
