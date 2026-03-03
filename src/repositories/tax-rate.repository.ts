import prisma from '../config/database';
import { Prisma } from '@prisma/client';

export const findAll = async (query?: Prisma.TaxRateFindManyArgs) => {
  return prisma.taxRate.findMany(query);
};

export const findById = async (id: string, include?: Prisma.TaxRateInclude) => {
  return prisma.taxRate.findUnique({
    where: { id },
    include
  });
};

export const findByName = async (name: string) => {
  return prisma.taxRate.findUnique({
    where: { name }
  });
};

export const create = async (data: Prisma.TaxRateCreateInput) => {
  return prisma.taxRate.create({
    data
  });
};

export const update = async (id: string, data: Prisma.TaxRateUpdateInput) => {
  return prisma.taxRate.update({
    where: { id },
    data
  });
};

export const deleteTaxRate = async (id: string) => {
  return prisma.taxRate.delete({
    where: { id }
  });
};
