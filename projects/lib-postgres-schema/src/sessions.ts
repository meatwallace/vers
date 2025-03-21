import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users';

export const sessions = pgTable('sessions', {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  id: text('id').notNull().primaryKey(),
  ipAddress: text('ip_address').notNull(),
  refreshToken: text('refresh_token'),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  userID: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  verified: boolean('verified').notNull().default(false),
});
