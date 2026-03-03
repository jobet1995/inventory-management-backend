import prisma from '../config/database';
import { Prisma } from '@prisma/client';

export const findAll = async (query?: Prisma.SalesReturnFindManyArgs) => {
  return prisma.salesReturn.findMany(query);
};

export const findById = async (id: string, include?: Prisma.SalesReturnInclude) => {
  return prisma.salesReturn.findUnique({
    where: { id },
    include
  });
};

export const create = async (data: Prisma.SalesReturnCreateInput) => {
  return prisma.salesReturn.create({
    data,
    include: {
      items: true
    }
  });
};

export const update = async (id: string, data: Prisma.SalesReturnUpdateInput) => {
  return prisma.salesReturn.update({
    where: { id },
    data,
    include: {
      items: true
    }
  });
};

export const deleteReturn = async (id: string) => {
  return prisma.salesReturn.delete({
    where: { id }
  });
};
