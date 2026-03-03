import prisma from '../config/database';
import ApiError from '../utils/ApiError';
import { StockMovementType, StockMovementReferenceType, Prisma } from '@prisma/client';

export const getAllStocks = async (query?: Prisma.StockFindManyArgs) => {
  return prisma.stock.findMany({
    where: { deletedAt: null, ...query?.where },
    include: {
      product: { select: { id: true, name: true, sku: true } },
      warehouse: { select: { id: true, name: true } },
    },
    ...query
  });
};

export const getStockById = async (id: string) => {
  const stock = await prisma.stock.findFirst({
    where: { id, deletedAt: null },
    include: {
      product: true,
      warehouse: true,
    }
  });

  if (!stock) {
    throw new ApiError(404, 'Stock record not found');
  }

  return stock;
};

// Simplified stock adjustment using a transaction
export const adjustStock = async (data: {
  productId: string;
  warehouseId: string;
  quantity: number;
  type: StockMovementType;
  referenceType: StockMovementReferenceType;
  referenceId?: string;
  note?: string;
}) => {
  return prisma.$transaction(async (tx) => {
    // 1. Find or create stock record
    let stock = await tx.stock.findUnique({
      where: {
        productId_warehouseId: {
          productId: data.productId,
          warehouseId: data.warehouseId
        }
      }
    });

    if (!stock) {
      stock = await tx.stock.create({
        data: {
          productId: data.productId,
          warehouseId: data.warehouseId,
          quantity: 0,
        }
      });
    }

    // 2. Calculate new quantity
    let newQuantity = stock.quantity;
    if (data.type === 'IN' || data.type === 'ADJUSTMENT') {
      newQuantity += data.quantity; // Note: for adjustment, quantity could be negative
    } else if (data.type === 'OUT' || data.type === 'TRANSFER') {
      newQuantity -= data.quantity;
      if (newQuantity < 0) {
        throw new ApiError(400, 'Insufficient stock');
      }
    }

    // 3. Update stock
    await tx.stock.update({
      where: { id: stock.id },
      data: { quantity: newQuantity }
    });

    // 4. Create movement record
    const movement = await tx.stockMovement.create({
      data: {
        productId: data.productId,
        warehouseId: data.warehouseId,
        type: data.type,
        quantity: data.quantity,
        referenceType: data.referenceType,
        referenceId: data.referenceId,
        note: data.note,
      }
    });

    return movement;
  });
};

export const getStockMovements = async (query?: Prisma.StockMovementFindManyArgs) => {
  return prisma.stockMovement.findMany({
    where: { deletedAt: null, ...query?.where },
    orderBy: { createdAt: 'desc' },
    include: {
      product: { select: { name: true, sku: true } },
      warehouse: { select: { name: true } }
    },
    ...query
  });
};
