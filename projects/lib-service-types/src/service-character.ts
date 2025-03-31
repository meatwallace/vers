export interface CharacterData {
  createdAt: Date;
  id: string;
  level: number;
  name: string;
  updatedAt: Date;
  userID: string;
  xp: number;
}

export type CreateCharacterPayload = CharacterData;

export interface DeleteCharacterPayload {
  deletedID: string;
}

export type GetCharacterPayload = CharacterData | null;

export type GetCharactersPayload = Array<CharacterData>;

export interface UpdateCharacterPayload {
  updatedID: string;
}
