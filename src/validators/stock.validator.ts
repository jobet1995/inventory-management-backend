import { z } from 'zod';

export const updateStockSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    warehouseId: z.string().min(1),
    quantity: z.number().int(),
    reorderLevel: z.number().int().nonnegative().optional(),
  })
});

export const stockAdjustmentSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    warehouseId: z.string().min(1),
    quantity: z.number().int(),
    type: z.enum(['IN', 'OUT', 'ADJUSTMENT', 'TRANSFER']),
    note: z.string().optional(),
  })
});
