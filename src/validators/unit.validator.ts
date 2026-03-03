import { z } from 'zod';

export const createUnitSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(50),
    shortName: z.string().min(1, 'Short name is required').max(10),
  })
});

export const updateUnitSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(50).optional(),
    shortName: z.string().min(1).max(10).optional(),
  })
});
