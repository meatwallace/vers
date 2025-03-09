import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const verificationTypeEnum = pgEnum('verification_type', [
  '2fa',
  '2fa-setup',
  'onboarding',
  'change-email',
]);

export const verifications = pgTable('verifications', {
  id: text('id').notNull().primaryKey(),
  createdAt: timestamp('created_at').notNull().defaultNow(),

  // type of verification i.e. email, phone, etc.
  type: verificationTypeEnum('type').notNull(),

  // the thing we're trying to verify i.e. a user's email or phone number
  target: text('target').notNull(),

  // the secret key used to generate the otp
  secret: text('secret').notNull(),

  // the algorithm used to generate the otp
  algorithm: text('algorithm').notNull(),

  // the number of digits in the otp
  digits: integer('digits').notNull(),

  // the number of seconds the otp is valid for
  period: integer('period').notNull(),

  // the valid characters for the otp
  charSet: text('char_set').notNull(),

  // when it's safe to delete this verification
  expiresAt: timestamp('expires_at'),
});
