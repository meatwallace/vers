import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const fantasyTypeEnum = pgEnum('fantasy_type', [
  'Low',
  'Medium',
  'High',
]);

export const technologyLevelEnum = pgEnum('technology_level', [
  'Ancient',
  'Medieval',
  'Modern',
  'Futuristic',
]);

export const archetypeEnum = pgEnum('archetype', [
  'Steampunk',
  'Dieselpunk',
  'Cyberpunk',
]);

export const atmosphereEnum = pgEnum('atmosphere', [
  'Dark',
  'Neutral',
  'Light',
]);

export const populationEnum = pgEnum('population', [
  'Sparse',
  'Average',
  'Dense',
]);

export const geographyTypeEnum = pgEnum('geography_type', [
  'Supercontinent',
  'Continents',
  'Islands',
  'Archipelago',
]);

export const geographyFeaturesEnum = pgEnum('geography_features', [
  'Deserts',
  'Forest',
  'Mountains',
  'Plains',
  'Swamps',
  'Tundra',
]);

export const worlds = pgTable('worlds', {
  archetype: archetypeEnum('archetype'),
  atmosphere: atmosphereEnum('atmosphere').notNull(),

  // meta
  createdAt: timestamp('created_at').notNull().defaultNow(),

  // world seed
  fantasyType: fantasyTypeEnum('fantasy_type').notNull(),
  geographyFeatures: geographyFeaturesEnum('geography_features')
    .array()
    .notNull(),
  geographyType: geographyTypeEnum('geography_type').notNull(),
  id: text('id').notNull().primaryKey(),
  // details
  name: text('name').notNull(),
  ownerID: text('owner_id')
    .notNull()
    .references(() => users.id),
  population: populationEnum('population').notNull(),

  technologyLevel: technologyLevelEnum('technology_level').notNull(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
