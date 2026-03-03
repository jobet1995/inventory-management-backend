import { z } from 'zod';

export const createCustomerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    companyName: z.string().optional().nullable(),
    taxId: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    loyaltyPoints: z.number().int().nonnegative().default(0),
  })
});

export const updateCustomerSchema = z.object({
  body: z.object({
    firstName: z.string().min(2).optional(),
    lastName: z.string().min(2).optional(),
    email: z.string().email().optional(),
    phone: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    companyName: z.string().optional().nullable(),
    taxId: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    loyaltyPoints: z.number().int().nonnegative().optional(),
  })
});
