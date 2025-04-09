import { z } from 'zod';

export const GetCharacterByIdSchema = z.object({
  characterId: z.number(),
});