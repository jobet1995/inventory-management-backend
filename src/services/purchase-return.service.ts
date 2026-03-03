import * as purchaseReturnRepository from '../repositories/purchase-return.repository';
import prisma from '../config/database';
import ApiError from '../utils/ApiError';
import { Prisma, ReturnStatus } from '@prisma/client';

export const getAllPurchaseReturns = async (query?: Prisma.PurchaseReturnFindManyArgs) => {
  return purchaseReturnRepository.findAll(query);
};

export const getPurchaseReturnById = async (id: string, include?: Prisma.PurchaseReturnInclude) => {
  const purchaseReturn = await purchaseReturnRepository.findById(id, include);
  if (!purchaseReturn) {
    throw new ApiError(404, 'Purchase return not found');
  }
  return purchaseReturn;
};

export const createPurchaseReturn = async (data: {
  purchaseOrderId: string;
  reason?: string;
  items: { productId: string; quantity: number; unitPrice: number }[];
}) => {
  // 1. Check if purchase order exists
  const purchaseOrder = await prisma.purchaseOrder.findUnique({
    where: { id: data.purchaseOrderId }
  });
  if (!purchaseOrder) {
    throw new ApiError(404, 'Purchase order not found');
  }

  // 2. Calculate total amount
  const totalAmount = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  // 3. Create return with items
  return purchaseReturnRepository.create({
    purchaseOrder: { connect: { id: data.purchaseOrderId } },
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

export const updatePurchaseReturnStatus = async (id: string, status: ReturnStatus) => {
  const purchaseReturn = await purchaseReturnRepository.findById(id);
  if (!purchaseReturn) {
    throw new ApiError(404, 'Purchase return not found');
  }

  return purchaseReturnRepository.update(id, { status });
};

export const deletePurchaseReturn = async (id: string) => {
  const purchaseReturn = await purchaseReturnRepository.findById(id);
  if (!purchaseReturn) {
    throw new ApiError(404, 'Purchase return not found');
  }
  return purchaseReturnRepository.deleteReturn(id);
};
