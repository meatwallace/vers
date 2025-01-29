import { createUser } from './create-user';
import { getUser } from './get-user';
import { verifyPassword } from './verify-password';
import { UserService } from './types';
import { CreateServiceContextConfig } from '../utils/types';
import { createServiceContext } from '../utils/create-service-context';

type UserServiceConfig = CreateServiceContextConfig;

export function createUserService(config: UserServiceConfig): UserService {
  const ctx = createServiceContext(config);

  return {
    createUser: (args) => createUser(args, ctx),
    getUser: (args) => getUser(args, ctx),
    verifyPassword: (args) => verifyPassword(args, ctx),
  };
}
