import { factory, nullable, primaryKey } from '@mswjs/data';
import { createId } from '@paralleldrive/cuid2';
import { Class } from '@vers/data';

export const db = factory({
  avatar: {
    class: () => Class.Brute as (typeof Class)[keyof typeof Class],
    createdAt: () => new Date(),
    id: primaryKey(() => createId()),
    level: () => 1,
    name: () => 'Test Avatar',
    updatedAt: () => new Date(),
    userID: () => createId(),
    xp: () => 0,
  },
  session: {
    createdAt: () => new Date(),
    expiresAt: () => new Date(),
    id: primaryKey(() => createId()),
    ipAddress: () => '127.0.0.1',
    refreshToken: nullable(() => 'refresh_token'),
    updatedAt: () => new Date(),
    userID: () => createId(),
    verified: Boolean,
  },
  user: {
    createdAt: () => new Date(),
    email: () => 'user@test.com',
    id: primaryKey(() => createId()),
    name: () => 'Test User',
    passwordHash: nullable<string>(() => null),
    passwordResetToken: nullable<string>(() => null),
    passwordResetTokenExpiresAt: nullable<Date>(() => null),
    updatedAt: () => new Date(),
    username: () => 'test_user',
  },
  verification: {
    algorithm: () => 'SHA-256',
    charSet: () => 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789',
    createdAt: () => new Date(),
    digits: () => 6,
    expiresAt: nullable(() => new Date(Date.now() + 1000 * 60 * 5)),
    id: primaryKey(() => createId()),
    period: () => 300,
    secret: () => 'secret',
    target: () => 'test@example.com',
    type: () => 'onboarding',
  },
});
