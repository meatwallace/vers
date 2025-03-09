import { createId } from '@paralleldrive/cuid2';
import { VerificationType } from '~/gql/graphql';
import { db } from '~/mocks/db';
import { createJWT } from './create-jwt';

interface UserParts {
  email?: string;
  id?: string;
  is2FAEnabled?: boolean;
  name?: string;
  password?: string;
}

export async function createAuthedUser(
  userParts: UserParts,
  sessionID?: string,
) {
  const user = db.user.create({ ...userParts });

  const accessToken = await createJWT({
    audience: 'test.com',
    issuer: 'http://test.com/',
    sub: user.id,
  });

  const refreshToken = await createJWT({
    audience: 'test.com',
    expirationTime: '1d',
    issuer: 'http://test.com/',
    sub: user.id,
  });

  const session = db.session.create({
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    id: sessionID ?? createId(),
    refreshToken,
    userID: user.id,
  });

  if (userParts.is2FAEnabled) {
    db.verification.create({
      target: user.email,
      type: VerificationType.TwoFactorAuth,
    });
  }

  return { accessToken, refreshToken, session, user };
}
