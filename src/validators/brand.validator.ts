import { z } from 'zod';

export const createBrandSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().optional().nullable(),
  })
});

export const updateBrandSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().optional().nullable(),
  })
});
