import prisma from '../config/database';
import { Prisma } from '@prisma/client';

export const findAll = async (query?: Prisma.PurchaseReturnFindManyArgs) => {
  return prisma.purchaseReturn.findMany(query);
};

export const findById = async (id: string, include?: Prisma.PurchaseReturnInclude) => {
  return prisma.purchaseReturn.findUnique({
    where: { id },
    include
  });
};

export const create = async (data: Prisma.PurchaseReturnCreateInput) => {
  return prisma.purchaseReturn.create({
    data,
    include: {
      items: true
    }
  });
};

export const update = async (id: string, data: Prisma.PurchaseReturnUpdateInput) => {
  return prisma.purchaseReturn.update({
    where: { id },
    data,
    include: {
      items: true
    }
  });
};

export const deleteReturn = async (id: string) => {
  return prisma.purchaseReturn.delete({
    where: { id }
  });
};
