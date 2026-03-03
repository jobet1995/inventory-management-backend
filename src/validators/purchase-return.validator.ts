import { z } from 'zod';
import { ReturnStatus } from '@prisma/client';

export const createPurchaseReturnSchema = z.object({
  body: z.object({
    purchaseOrderId: z.string().min(1, 'Purchase order ID is required'),
    reason: z.string().optional().nullable(),
    items: z.array(z.object({
      productId: z.string().min(1, 'Product ID is required'),
      quantity: z.number().int().positive('Quantity must be positive'),
      unitPrice: z.number().positive('Unit price must be positive'),
    })).min(1, 'At least one item is required'),
  })
});

export const updatePurchaseReturnStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(ReturnStatus),
  })
});
