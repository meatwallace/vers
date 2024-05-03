import { getCurrentUser } from './get-current-user';
import { getOrCreateUser } from './get-or-create-user';

import { createWorld } from './create-world';
import { deleteWorld } from './delete-world';
import { getWorld } from './get-world';
import { getWorlds } from './get-worlds';
import { updateWorld } from './update-world';

export const handlers = [
  // users
  getCurrentUser,
  getOrCreateUser,

  // worlds
  createWorld,
  getWorld,
  getWorlds,
  deleteWorld,
  updateWorld,
];
