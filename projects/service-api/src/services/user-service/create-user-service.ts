import { createServiceContext } from '../utils/create-service-context';
import { CreateServiceContextConfig } from '../utils/types';
import { changePassword } from './change-password';
import { createPasswordResetToken } from './create-password-reset-token';
import { createUser } from './create-user';
import { getUser } from './get-user';
import { UserService } from './types';
import { updateUser } from './update-user';
import { verifyPassword } from './verify-password';

type UserServiceConfig = CreateServiceContextConfig;

export function createUserService(config: UserServiceConfig): UserService {
  const ctx = createServiceContext(config);

  return {
    changePassword: (args) => changePassword(args, ctx),
    createPasswordResetToken: (args) => createPasswordResetToken(args, ctx),
    createUser: (args) => createUser(args, ctx),
    getUser: (args) => getUser(args, ctx),
    updateUser: (args) => updateUser(args, ctx),
    verifyPassword: (args) => verifyPassword(args, ctx),
  };
}
