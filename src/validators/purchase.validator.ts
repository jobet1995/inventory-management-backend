import { z } from 'zod';

export const createPurchaseOrderSchema = z.object({
  body: z.object({
    supplierId: z.string().min(1, "Supplier ID is required"),
    expectedDeliveryDate: z.string().datetime().optional(),
    notes: z.string().optional(),
    items: z.array(z.object({
      productId: z.string().min(1, "Product ID is required"),
      quantity: z.number().int().positive("Quantity must be a positive integer"),
      unitPrice: z.number().positive("Unit price must be positive"),
      discount: z.number().nonnegative().default(0),
    })).min(1, "Order must have at least one item")
  })
});

export const updatePurchaseOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'APPROVED', 'COMPLETED', 'CANCELLED'])
  })
});

export const getPurchaseOrderSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});
