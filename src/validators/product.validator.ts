import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    sku: z.string().min(3, "SKU must be at least 3 characters").max(50, "SKU must not exceed 50 characters"),
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must not exceed 100 characters"),
    description: z.string().optional(),
    price: z.number().positive("Price must be a positive number"),
    costPrice: z.number().positive("Cost price must be a positive number"),
    weight: z.number().optional().nullable(),
    height: z.number().optional().nullable(),
    width: z.number().optional().nullable(),
    length: z.number().optional().nullable(),
    barcode: z.string().optional().nullable(),
    categoryId: z.string().min(1, "Category ID is required"),
    supplierId: z.string().min(1, "Supplier ID is required"),
    isActive: z.boolean().default(true),
  })
});

export const updateProductSchema = z.object({
  body: z.object({
    sku: z.string().min(3).max(50).optional(),
    name: z.string().min(2).max(100).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    costPrice: z.number().positive().optional(),
    weight: z.number().optional().nullable(),
    height: z.number().optional().nullable(),
    width: z.number().optional().nullable(),
    length: z.number().optional().nullable(),
    barcode: z.string().optional().nullable(),
    categoryId: z.string().optional(),
    supplierId: z.string().optional(),
    isActive: z.boolean().optional(),
  })
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Product ID is required")
  })
});
