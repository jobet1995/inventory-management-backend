import prisma from '../config/database';
import ApiError from '../utils/ApiError';
import { SalesOrderStatus, Prisma } from '@prisma/client';

export const getAllSalesOrders = async (query?: Prisma.SalesOrderFindManyArgs) => {
  return prisma.salesOrder.findMany({
    where: { deletedAt: null, ...query?.where },
    include: {
      customer: { select: { firstName: true, lastName: true } },
      createdBy: { select: { firstName: true, lastName: true } },
      items: true
    },
    ...query
  });
};

export const getSalesOrderById = async (id: string) => {
  const order = await prisma.salesOrder.findFirst({
    where: { id, deletedAt: null },
    include: {
      customer: true,
      items: {
        include: {
          product: { select: { name: true, sku: true } }
        }
      },
      payments: true,
      invoices: true,
    }
  });

  if (!order) {
    throw new ApiError(404, 'Sales order not found');
  }

  return order;
};

export const createSalesOrder = async (data: Prisma.SalesOrderUncheckedCreateInput & { items: Prisma.SalesOrderItemUncheckedCreateWithoutSalesOrderInput[] }) => {
  return prisma.$transaction(async (tx) => {
    // Calculate total price server-side as requested in comments
    const calculatedTotal = data.items.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unitPrice)) - Number(item.discount || 0), 0);
    // 1. Create the sales order with items
    const order = await tx.salesOrder.create({
      data: {
        customerId: data.customerId,
        createdById: data.createdById,
        totalPrice: calculatedTotal,
        shippingAddress: data.shippingAddress,
        status: data.status || 'PENDING',
        paymentStatus: data.paymentStatus || 'PENDING',
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            totalPrice: (Number(item.quantity) * Number(item.unitPrice)) - Number(item.discount || 0)
          }))
        }
      },
      include: { items: true }
    });

    return order;
  });
};

export const updateSalesOrderStatus = async (id: string, status: SalesOrderStatus) => {
  const order = await prisma.salesOrder.findFirst({ where: { id, deletedAt: null } });
  if (!order) {
    throw new ApiError(404, 'Sales order not found');
  }

  return prisma.salesOrder.update({
    where: { id },
    data: { status }
  });
};
