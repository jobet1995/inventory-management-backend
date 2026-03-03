import prisma from '../config/database';
import ApiError from '../utils/ApiError';
import { PurchaseOrderStatus, Prisma } from '@prisma/client';

export const getAllPurchaseOrders = async (query?: Prisma.PurchaseOrderFindManyArgs) => {
  return prisma.purchaseOrder.findMany({
    where: { deletedAt: null, ...query?.where },
    include: {
      supplier: { select: { name: true } },
      createdBy: { select: { firstName: true, lastName: true } },
      items: true
    },
    ...query
  });
};

export const getPurchaseOrderById = async (id: string) => {
  const order = await prisma.purchaseOrder.findFirst({
    where: { id, deletedAt: null },
    include: {
      supplier: true,
      items: {
        include: {
          product: { select: { name: true, sku: true } }
        }
      },
      payments: true,
    }
  });

  if (!order) {
    throw new ApiError(404, 'Purchase order not found');
  }

  return order;
};

export const createPurchaseOrder = async (data: Prisma.PurchaseOrderUncheckedCreateInput & { items: Prisma.PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput[] }) => {
  return prisma.$transaction(async (tx) => {
    // Calculate total price server-side as requested in comments
    const calculatedTotal = data.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)), 0);

    // 1. Create the purchase order with items
    const order = await tx.purchaseOrder.create({
      data: {
        supplierId: data.supplierId,
        createdById: data.createdById,
        expectedDeliveryDate: data.expectedDeliveryDate,
        totalPrice: calculatedTotal,
        notes: data.notes,
        status: data.status || 'PENDING',
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: Number(item.quantity) * Number(item.unitPrice)
          }))
        }
      },
      include: { items: true }
    });

    return order;
  });
};

export const updateOrderStatus = async (id: string, status: PurchaseOrderStatus) => {
  const order = await prisma.purchaseOrder.findFirst({ where: { id, deletedAt: null } });
  if (!order) {
    throw new ApiError(404, 'Purchase order not found');
  }

  // If status is completed, you might want to automatically update stock in a real app

  return prisma.purchaseOrder.update({
    where: { id },
    data: { status }
  });
};
