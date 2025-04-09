import { z } from 'zod';

export const GetComicsSchema = z.object({
  format: z.string().optional(),
  formatType: z.string().optional(),
  noVariants: z.boolean().optional(),
  dateDescriptor: z.string().optional(),
  dateRange: z.string().optional(),
  title: z.string().optional(),
  titleStartsWith: z.string().optional(),
  startYear: z.number().optional(),
  issueNumber: z.number().optional(),
  diamondCode: z.string().optional(),
  digitalId: z.number().optional(),
  upc: z.string().optional(),
  isbn: z.string().optional(),
  ean: z.string().optional(),
  issn: z.string().optional(),
  hasDigitalIssue: z.boolean().optional(),
  modifiedSince: z.string().optional(),
  creators: z.string().optional(),
  characters: z.string().optional(),
  series: z.string().optional(),
  events: z.string().optional(),
  stories: z.string().optional(),
  sharedAppearances: z.string().optional(),
  collaborators: z.string().optional(),
  orderBy: z.string().optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().optional(),
});