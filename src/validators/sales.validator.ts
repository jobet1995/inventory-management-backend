import { z } from 'zod';

export const createSalesOrderSchema = z.object({
  body: z.object({
    customerId: z.string().min(1, "Customer ID is required"),
    shippingAddress: z.string().optional(),
    items: z.array(z.object({
      productId: z.string().min(1, "Product ID is required"),
      quantity: z.number().int().positive("Quantity must be a positive integer"),
      unitPrice: z.number().positive("Unit price must be positive"),
      discount: z.number().nonnegative().default(0),
    })).min(1, "Order must have at least one item")
  })
});

export const updateSalesOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RETURNED', 'PARTIALLY_COMPLETED']),
    paymentStatus: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']).optional()
  })
});

export const getSalesOrderSchema = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});
