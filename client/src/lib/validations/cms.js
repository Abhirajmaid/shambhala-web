import { z } from 'zod';

export const slugSchema = z.string().min(2).regex(/^[a-z0-9-]+$/, 'Use lowercase letters, numbers, and dashes');
export const genericCmsSchema = z.object({
  title: z.string().optional(),
  name: z.string().optional(),
  slug: slugSchema.optional(),
  order: z.coerce.number().default(0),
  published: z.coerce.boolean().default(false),
});
