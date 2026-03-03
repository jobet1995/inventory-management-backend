import { z } from 'zod';

export const createSupplierSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Supplier name is required"),
    contactName: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    taxId: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  })
});

export const updateSupplierSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    contactName: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    taxId: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  })
});
