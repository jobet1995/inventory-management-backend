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

export type CreatePurchaseOrderInput = Omit<Prisma.PurchaseOrderUncheckedCreateInput, 'totalPrice' | 'createdById'> & {
  createdById: string;
  items: (Omit<Prisma.PurchaseOrderItemUncheckedCreateWithoutPurchaseOrderInput, 'totalPrice' | 'purchaseOrderId'> & {
    discount?: number;
  })[];
};

export const createPurchaseOrder = async (data: CreatePurchaseOrderInput) => {
  return prisma.$transaction(async (tx) => {
    // Calculate each item's price and the total price server-side
    const processedItems = data.items.map(item => {
      const quantity = Number(item.quantity);
      const unitPrice = Number(item.unitPrice);
      const discount = Number(item.discount || 0);
      const totalPrice = quantity * (unitPrice - discount);
      
      return {
        ...item,
        quantity,
        unitPrice,
        discount,
        totalPrice
      };
    });

    const calculatedTotal = processedItems.reduce((sum, item) => sum + item.totalPrice, 0);

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
          create: processedItems
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
