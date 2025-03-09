import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  createdAt: timestamp('created_at').notNull().defaultNow(),
  email: text('email').notNull().unique(),
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull(),
  passwordHash: text('password_hash'),
  passwordResetToken: text('password_reset_token'),
  passwordResetTokenExpiresAt: timestamp('password_reset_token_expires_at'),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  username: text('username').notNull().unique(),
});
