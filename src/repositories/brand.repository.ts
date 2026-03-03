import prisma from '../config/database';
import { Prisma } from '@prisma/client';

export const findAll = async (query?: Prisma.BrandFindManyArgs) => {
  return prisma.brand.findMany(query);
};

export const findById = async (id: string, include?: Prisma.BrandInclude) => {
  return prisma.brand.findUnique({
    where: { id },
    include
  });
};

export const findByName = async (name: string) => {
  return prisma.brand.findUnique({
    where: { name }
  });
};

export const create = async (data: Prisma.BrandCreateInput) => {
  return prisma.brand.create({
    data
  });
};

export const update = async (id: string, data: Prisma.BrandUpdateInput) => {
  return prisma.brand.update({
    where: { id },
    data
  });
};

export const deleteBrand = async (id: string) => {
  return prisma.brand.delete({
    where: { id }
  });
};
