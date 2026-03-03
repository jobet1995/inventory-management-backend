import prisma from '../config/database';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';

export const getAllWarehouses = async (query?: Prisma.WarehouseFindManyArgs) => {
  return prisma.warehouse.findMany({
    where: { deletedAt: null, ...query?.where },
    include: {
      manager: { select: { id: true, firstName: true, lastName: true } }
    },
    ...query
  });
};

export const getWarehouseById = async (id: string) => {
  const warehouse = await prisma.warehouse.findFirst({
    where: { id, deletedAt: null },
    include: {
      manager: { select: { id: true, firstName: true, lastName: true } }
    }
  });

  if (!warehouse) {
    throw new ApiError(404, 'Warehouse not found');
  }

  return warehouse;
};

export const createWarehouse = async (data: Prisma.WarehouseCreateInput) => {
  return prisma.warehouse.create({ data });
};

export const updateWarehouse = async (id: string, data: Prisma.WarehouseUpdateInput) => {
  const warehouse = await prisma.warehouse.findFirst({ where: { id, deletedAt: null } });
  if (!warehouse) {
    throw new ApiError(404, 'Warehouse not found');
  }

  return prisma.warehouse.update({
    where: { id },
    data,
  });
};

export const deleteWarehouse = async (id: string) => {
  const warehouse = await prisma.warehouse.findFirst({ where: { id, deletedAt: null } });
  if (!warehouse) {
    throw new ApiError(404, 'Warehouse not found');
  }

  return prisma.warehouse.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
};
