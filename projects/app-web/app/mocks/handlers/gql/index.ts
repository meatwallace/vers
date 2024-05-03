import { GetCurrentUser } from './get-current-user';
import { GetOrCreateUser } from './get-or-create-user';

import { CreateWorld } from './create-world';
import { DeleteWorld } from './delete-world';
import { GetWorlds } from './get-worlds';
import { GetWorld } from './get-world';

export const handlers = [
  GetCurrentUser,
  GetOrCreateUser,

  CreateWorld,
  DeleteWorld,
  GetWorlds,
  GetWorld,
];
