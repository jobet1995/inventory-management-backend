import prisma from '../config/database';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';

export const getAllProducts = async (query?: Prisma.ProductFindManyArgs) => {
  return prisma.product.findMany({
    where: { deletedAt: null, isActive: true, ...query?.where },
    include: {
      category: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true } },
      stocks: true,
    },
    ...query
  });
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findFirst({
    where: { id, deletedAt: null },
    include: {
      category: true,
      supplier: true,
      stocks: {
        include: {
          warehouse: { select: { id: true, name: true } }
        }
      }
    }
  });

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  return product;
};

export interface CreateProductDTO {
  sku: string;
  name: string;
  description?: string;
  price: number;
  costPrice: number;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  barcode?: string;
  categoryId: string;
  supplierId: string;
  isActive?: boolean;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export const createProduct = async (data: CreateProductDTO) => {
  const { sku, categoryId, supplierId, ...otherData } = data;

  // 1. Check if SKU exists
  const existingProduct = await prisma.product.findUnique({ where: { sku } });
  if (existingProduct) {
    throw new ApiError(400, 'Product with this SKU already exists');
  }

  // 2. Check if Category exists
  const category = await prisma.category.findUnique({ where: { id: categoryId, deletedAt: null } });
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  // 3. Check if Supplier exists
  const supplier = await prisma.supplier.findUnique({ where: { id: supplierId, deletedAt: null } });
  if (!supplier) {
    throw new ApiError(404, 'Supplier not found');
  }

  return prisma.product.create({
    data: {
      sku,
      name: otherData.name,
      description: otherData.description,
      price: otherData.price,
      costPrice: otherData.costPrice,
      weight: otherData.weight,
      height: otherData.height,
      width: otherData.width,
      length: otherData.length,
      barcode: otherData.barcode,
      isActive: otherData.isActive,
      category: { connect: { id: categoryId } },
      supplier: { connect: { id: supplierId } },
    },
    include: {
      category: true,
      supplier: true,
    }
  });
};

export const updateProduct = async (id: string, data: UpdateProductDTO) => {
  const product = await prisma.product.findFirst({ where: { id, deletedAt: null } });
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const { categoryId, supplierId, ...otherData } = data;

  // 1. Check category if provided
  if (categoryId) {
    const category = await prisma.category.findUnique({ where: { id: categoryId, deletedAt: null } });
    if (!category) throw new ApiError(404, 'Category not found');
  }

  // 2. Check supplier if provided
  if (supplierId) {
    const supplier = await prisma.supplier.findUnique({ where: { id: supplierId, deletedAt: null } });
    if (!supplier) throw new ApiError(404, 'Supplier not found');
  }

  return prisma.product.update({
    where: { id },
    data: {
      ...otherData,
      ...(categoryId && { category: { connect: { id: categoryId } } }),
      ...(supplierId && { supplier: { connect: { id: supplierId } } }),
    },
    include: {
      category: true,
      supplier: true,
    }
  });
};

export const deleteProduct = async (id: string) => {
  const product = await prisma.product.findFirst({ where: { id, deletedAt: null } });
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  // Soft delete
  return prisma.product.update({
    where: { id },
    data: { deletedAt: new Date(), isActive: false }
  });
};
