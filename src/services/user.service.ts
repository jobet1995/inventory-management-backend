import prisma from '../config/database';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';

export const getAllUsers = async (query?: Prisma.UserFindManyArgs) => {
  return prisma.user.findMany({
    where: {
      deletedAt: null, // Only fetch non-deleted users (Soft Delete)
      ...query?.where
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      lastLoginAt: true,
      createdAt: true,
    },
    ...query
  });
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: { id, deletedAt: null },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      lastLoginAt: true,
      createdAt: true,
    }
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return user;
};

export const createUser = async (data: Prisma.UserCreateInput) => {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw new ApiError(400, 'Email already taken');
  }

  return prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password, // Should be hashed in real implementation
      phone: data.phone,
      role: data.role || 'STAFF',
      status: data.status || 'ACTIVE',
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    }
  });
};

export const updateUser = async (id: string, data: Prisma.UserUpdateInput) => {
  const user = await prisma.user.findFirst({ where: { id, deletedAt: null } });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return prisma.user.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role,
      status: data.status,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    }
  });
};

export const deleteUser = async (id: string) => {
  const user = await prisma.user.findFirst({ where: { id, deletedAt: null } });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  // Soft delete
  return prisma.user.update({
    where: { id },
    data: { deletedAt: new Date(), status: 'INACTIVE' }
  });
};
