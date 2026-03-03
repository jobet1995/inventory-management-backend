import prisma from '../config/database';
import { Prisma } from '@prisma/client';

export const findAll = async (query?: Prisma.UnitFindManyArgs) => {
  return prisma.unit.findMany(query);
};

export const findById = async (id: string, include?: Prisma.UnitInclude) => {
  return prisma.unit.findUnique({
    where: { id },
    include
  });
};

export const findByName = async (name: string) => {
  return prisma.unit.findUnique({
    where: { name }
  });
};

export const findByShortName = async (shortName: string) => {
  return prisma.unit.findUnique({
    where: { shortName }
  });
};

export const create = async (data: Prisma.UnitCreateInput) => {
  return prisma.unit.create({
    data
  });
};

export const update = async (id: string, data: Prisma.UnitUpdateInput) => {
  return prisma.unit.update({
    where: { id },
    data
  });
};

export const deleteUnit = async (id: string) => {
  return prisma.unit.delete({
    where: { id }
  });
};
