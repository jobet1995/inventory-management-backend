import { z } from 'zod';

export const createWarehouseSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    location: z.string().optional(),
    type: z.enum(['MAIN', 'BRANCH', 'VIRTUAL']).default('MAIN'),
    capacity: z.number().int().positive().optional().nullable(),
    managerId: z.string().optional().nullable(),
  })
});

export const updateWarehouseSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    location: z.string().optional(),
    type: z.enum(['MAIN', 'BRANCH', 'VIRTUAL']).optional(),
    capacity: z.number().int().positive().optional().nullable(),
    managerId: z.string().optional().nullable(),
  })
});
