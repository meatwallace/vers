import { z } from 'zod';

export const CharacterNameSchema = z.string().min(1).max(16);
