import { z } from 'zod';

export const createInvoiceSchema = z.object({
  body: z.object({
    salesOrderId: z.string().min(1),
    invoiceNumber: z.string().min(1),
    totalAmount: z.number().positive(),
    dueDate: z.string().datetime().nullable().optional(),
    status: z.enum(['DRAFT', 'PENDING', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED']).default('DRAFT'),
  })
});

export const updateInvoiceStatusSchema = z.object({
  body: z.object({
    status: z.enum(['DRAFT', 'PENDING', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED'])
  })
});
