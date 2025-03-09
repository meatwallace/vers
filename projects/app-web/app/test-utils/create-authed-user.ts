import { createId } from '@paralleldrive/cuid2';
import { VerificationType } from '~/gql/graphql';
import { db } from '~/mocks/db';
import { createJWT } from './create-jwt';

interface UserParts {
  id?: string;
  email?: string;
  password?: string;
  name?: string;
  is2FAEnabled?: boolean;
}

export async function createAuthedUser(
  userParts: UserParts,
  sessionID?: string,
) {
  const user = db.user.create({ ...userParts });

  const accessToken = await createJWT({
    sub: user.id,
    audience: 'test.com',
    issuer: 'http://test.com/',
  });

  const refreshToken = await createJWT({
    sub: user.id,
    audience: 'test.com',
    issuer: 'http://test.com/',
    expirationTime: '1d',
  });

  const session = db.session.create({
    id: sessionID ?? createId(),
    userID: user.id,
    refreshToken,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  });

  if (userParts.is2FAEnabled) {
    db.verification.create({
      type: VerificationType.TwoFactorAuth,
      target: user.email,
    });
  }

  return { accessToken, refreshToken, user, session };
}
