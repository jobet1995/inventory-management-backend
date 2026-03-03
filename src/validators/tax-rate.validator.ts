import { z } from 'zod';

export const createTaxRateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    percentage: z.number().min(0).max(100),
  })
});

export const updateTaxRateSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    percentage: z.number().min(0).max(100).optional(),
  })
});
