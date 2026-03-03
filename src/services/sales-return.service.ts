import * as salesReturnRepository from '../repositories/sales-return.repository';
import prisma from '../config/database';
import ApiError from '../utils/ApiError';
import { Prisma, ReturnStatus } from '@prisma/client';

export const getAllSalesReturns = async (query?: Prisma.SalesReturnFindManyArgs) => {
  return salesReturnRepository.findAll(query);
};

export const getSalesReturnById = async (id: string, include?: Prisma.SalesReturnInclude) => {
  const salesReturn = await salesReturnRepository.findById(id, include);
  if (!salesReturn) {
    throw new ApiError(404, 'Sales return not found');
  }
  return salesReturn;
};

export const createSalesReturn = async (data: {
  salesOrderId: string;
  reason?: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
}) => {
  // 1. Check if sales order exists
  const salesOrder = await prisma.salesOrder.findUnique({
    where: { id: data.salesOrderId }
  });
  if (!salesOrder) {
    throw new ApiError(404, 'Sales order not found');
  }

  // 2. Calculate total amount
  const totalAmount = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  // 3. Create return with items
  return salesReturnRepository.create({
    salesOrder: { connect: { id: data.salesOrderId } },
    reason: data.reason,
    totalAmount,
    status: ReturnStatus.PENDING,
    items: {
      create: data.items.map(item => ({
        product: { connect: { id: item.productId } },
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice
      }))
    }
  });
};

export const updateSalesReturnStatus = async (id: string, status: ReturnStatus) => {
  const salesReturn = await salesReturnRepository.findById(id);
  if (!salesReturn) {
    throw new ApiError(404, 'Sales return not found');
  }

  return salesReturnRepository.update(id, { status });
};

export const deleteSalesReturn = async (id: string) => {
  const salesReturn = await salesReturnRepository.findById(id);
  if (!salesReturn) {
    throw new ApiError(404, 'Sales return not found');
  }
  return salesReturnRepository.deleteReturn(id);
};
