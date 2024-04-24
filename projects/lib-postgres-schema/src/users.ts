import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique(),
  emailVerified: boolean('email_verified'),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});
