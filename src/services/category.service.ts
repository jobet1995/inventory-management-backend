import prisma from '../config/database';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';

export const getAllCategories = async () => {
  return prisma.category.findMany({
    where: { deletedAt: null },
    include: {
      subCategories: {
        where: { deletedAt: null },
      },
    },
  });
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findFirst({
    where: { id, deletedAt: null },
    include: {
      subCategories: {
        where: { deletedAt: null },
      },
      products: {
        where: { deletedAt: null },
        take: 10, // Preview of products
      }
    }
  });

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  return category;
};

export const createCategory = async (data: Prisma.CategoryCreateInput) => {
  const existingCategory = await prisma.category.findUnique({ where: { name: data.name } });
  if (existingCategory) {
    throw new ApiError(400, 'Category with this name already exists');
  }

  return prisma.category.create({
    data,
  });
};

export const updateCategory = async (id: string, data: Prisma.CategoryUpdateInput) => {
  const category = await prisma.category.findFirst({ where: { id, deletedAt: null } });
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  return prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findFirst({ where: { id, deletedAt: null } });
  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  // Soft delete
  return prisma.category.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
};
