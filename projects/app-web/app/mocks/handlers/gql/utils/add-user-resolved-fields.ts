import { User, VerificationType } from '~/gql/graphql';
import { db } from '~/mocks/db';

interface DBUser {
  id: string;
  email: string;
  username: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Adds fields to the User that would be resolved by the GraphQL server
 * @param user - The user to add the resolved fields to
 * @returns The user with the resolved fields
 */
export function addUserResolvedFields(user: DBUser): User {
  const twoFactorAuthEnabled = db.verification.findFirst({
    where: {
      target: { equals: user.email },
      type: { equals: VerificationType.TwoFactorAuth },
    },
  });

  return {
    ...user,
    is2FAEnabled: twoFactorAuthEnabled !== null,
  };
}
