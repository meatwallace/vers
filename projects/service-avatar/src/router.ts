import { procedure as createAvatar } from './handlers/create-avatar';
import { procedure as deleteAvatar } from './handlers/delete-avatar';
import { procedure as getAvatar } from './handlers/get-avatar';
import { procedure as getAvatars } from './handlers/get-avatars';
import { procedure as updateAvatar } from './handlers/update-avatar';
import { t } from './t';

export const router = t.router({
  createAvatar,
  deleteAvatar,
  getAvatar,
  getAvatars,
  updateAvatar,
});
