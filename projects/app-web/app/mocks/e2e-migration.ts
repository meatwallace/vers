import { db } from './db';

// basic user for login flow
db.user.create({
  email: 'e2e-user@test.com',
  name: 'E2E User',
  password: 'password',
});

// 2FA enabled user for 2fa flow
db.user.create({
  email: 'e2e-2fa-user@test.com',
  name: 'E2E 2FA User',
  password: 'password',
});

db.verification.create({
  target: 'e2e-2fa-user@test.com',
  type: '2fa',
});

// basic user for enable 2FA flow
db.user.create({
  email: 'e2e-enable-2fa-user@test.com',
  name: 'E2E Enable 2FA User',
  password: 'password',
});

// 2FA enabled user for disable 2FA flow
db.user.create({
  email: 'e2e-disable-2fa-user@test.com',
  name: 'E2E Disable 2FA User',
  password: 'password',
});

db.verification.create({
  target: 'e2e-disable-2fa-user@test.com',
  type: '2fa',
});

// basic user for change password flow
db.user.create({
  email: 'e2e-change-password-user@test.com',
  name: 'E2E Change Password User',
});

// 2FA user for change password flow
db.user.create({
  email: 'e2e-change-password-2fa-user@test.com',
  name: 'E2E Change Password 2FA User',
});

db.verification.create({
  target: 'e2e-change-password-2fa-user@test.com',
  type: '2fa',
});

// basic user for change email flow
db.user.create({
  email: 'e2e-change-email-user@test.com',
  name: 'E2E Change Email User',
});

// 2FA user for change email flow
db.user.create({
  email: 'e2e-change-email-2fa-user@test.com',
  name: 'E2E Change Email 2FA User',
});

db.verification.create({
  target: 'e2e-change-email-2fa-user@test.com',
  type: '2fa',
});
