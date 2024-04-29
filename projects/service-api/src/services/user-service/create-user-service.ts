import { createServiceContext } from '../utils/create-service-context';
import { CreateServiceContextConfig } from '../utils/types';
import { getCurrentUser } from './get-current-user';
import { getOrCreateUser } from './get-or-create-user';
import { GetCurrentUserArgs, GetOrCreateUserArgs, UserService } from './types';

type UserServiceConfig = CreateServiceContextConfig;

export function createUserService(config: UserServiceConfig): UserService {
  const ctx = createServiceContext(config);

  return {
    getCurrentUser: async (args: GetCurrentUserArgs) =>
      getCurrentUser(args, ctx),
    getOrCreateUser: async (args: GetOrCreateUserArgs) =>
      getOrCreateUser(args, ctx),
  };
}
