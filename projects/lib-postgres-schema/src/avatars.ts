import { Class } from '@vers/data';
import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const avatarClassEnum = pgEnum('avatar_class', [
  Class.Brute,
  Class.Scoundrel,
  Class.Scholar,
]);

export const avatars = pgTable('avatars', {
  class: avatarClassEnum('class').notNull(),
  id: text('id').notNull().primaryKey(),
  level: integer('level').notNull().default(1),
  name: text('name').notNull().unique(),
  userID: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  xp: integer('xp').notNull().default(0),

  // meta
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
