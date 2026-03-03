import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    orderId: z.string().min(1),
    type: z.enum(['PURCHASE', 'SALES']),
    amount: z.number().positive(),
    method: z.enum(['CASH', 'CREDIT_CARD', 'BANK_TRANSFER', 'CHEQUE', 'PAYPAL']),
    status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']).default('PENDING'),
    transactionId: z.string().optional().nullable(),
    invoiceId: z.string().optional().nullable(),
    purchaseOrderId: z.string().optional().nullable(),
    salesOrderId: z.string().optional().nullable(),
  })
});

export const updatePaymentStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']),
    transactionId: z.string().optional(),
  })
});
