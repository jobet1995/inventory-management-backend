import prisma from '../config/database';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';

export const getAllSuppliers = async (query?: Prisma.SupplierFindManyArgs) => {
  return prisma.supplier.findMany({
    where: { deletedAt: null, ...query?.where },
    ...query
  });
};

export const getSupplierById = async (id: string) => {
  const supplier = await prisma.supplier.findFirst({
    where: { id, deletedAt: null },
    include: {
      products: {
        where: { deletedAt: null, isActive: true },
        take: 10,
      }
    }
  });

  if (!supplier) {
    throw new ApiError(404, 'Supplier not found');
  }

  return supplier;
};

export const createSupplier = async (data: Prisma.SupplierCreateInput) => {
  return prisma.supplier.create({ data });
};

export const updateSupplier = async (id: string, data: Prisma.SupplierUpdateInput) => {
  const supplier = await prisma.supplier.findFirst({ where: { id, deletedAt: null } });
  if (!supplier) {
    throw new ApiError(404, 'Supplier not found');
  }

  return prisma.supplier.update({
    where: { id },
    data,
  });
};

export const deleteSupplier = async (id: string) => {
  const supplier = await prisma.supplier.findFirst({ where: { id, deletedAt: null } });
  if (!supplier) {
    throw new ApiError(404, 'Supplier not found');
  }

  return prisma.supplier.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
};
