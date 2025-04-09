import { z } from 'zod';

export const GetComicByIdSchema = z.object({
  comicId: z.number(),
});