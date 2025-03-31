import { procedure as createCharacter } from './handlers/create-character';
import { procedure as deleteCharacter } from './handlers/delete-character';
import { procedure as getCharacter } from './handlers/get-character';
import { procedure as getCharacters } from './handlers/get-characters';
import { procedure as updateCharacter } from './handlers/update-character';
import { t } from './t';

export const router = t.router({
  createCharacter,
  deleteCharacter,
  getCharacter,
  getCharacters,
  updateCharacter,
});
