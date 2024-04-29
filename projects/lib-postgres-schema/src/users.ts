import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').notNull().primaryKey(),
  auth0ID: text('auth0_id').notNull().unique(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  name: text('name').notNull(),
  firstName: text('first_name'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
