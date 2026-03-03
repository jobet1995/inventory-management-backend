import { z } from 'zod';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    description: z.string().optional(),
    parentCategoryId: z.string().optional().nullable(),
  })
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    description: z.string().optional(),
    parentCategoryId: z.string().optional().nullable(),
  })
});
