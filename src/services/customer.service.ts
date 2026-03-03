import prisma from '../config/database';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';

export const getAllCustomers = async (query?: Prisma.CustomerFindManyArgs) => {
  return prisma.customer.findMany({
    where: { deletedAt: null, ...query?.where },
    ...query
  });
};

export const getCustomerById = async (id: string) => {
  const customer = await prisma.customer.findFirst({
    where: { id, deletedAt: null },
    include: {
      salesOrders: {
        take: 10,
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  return customer;
};

export const createCustomer = async (data: Prisma.CustomerCreateInput) => {
  const existingCustomer = await prisma.customer.findUnique({ where: { email: data.email } });
  if (existingCustomer) {
    throw new ApiError(400, 'Customer with this email already exists');
  }

  return prisma.customer.create({ data });
};

export const updateCustomer = async (id: string, data: Prisma.CustomerUpdateInput) => {
  const customer = await prisma.customer.findFirst({ where: { id, deletedAt: null } });
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  return prisma.customer.update({
    where: { id },
    data,
  });
};

export const deleteCustomer = async (id: string) => {
  const customer = await prisma.customer.findFirst({ where: { id, deletedAt: null } });
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  return prisma.customer.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
};
