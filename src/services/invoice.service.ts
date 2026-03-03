import prisma from '../config/database';
import ApiError from '../utils/ApiError';
import { InvoiceStatus, Prisma } from '@prisma/client';

export const getAllInvoices = async (query?: Prisma.InvoiceFindManyArgs) => {
  return prisma.invoice.findMany({
    where: { deletedAt: null, ...query?.where },
    include: {
      salesOrder: {
        include: {
          customer: { select: { firstName: true, lastName: true } }
        }
      }
    },
    ...query
  });
};

export const getInvoiceById = async (id: string) => {
  const invoice = await prisma.invoice.findFirst({
    where: { id, deletedAt: null },
    include: {
      salesOrder: {
        include: {
          customer: true,
          items: {
            include: { product: { select: { name: true } } }
          }
        }
      }
    }
  });

  if (!invoice) {
    throw new ApiError(404, 'Invoice not found');
  }

  return invoice;
};

export const createInvoice = async (data: Prisma.InvoiceCreateInput) => {
  return prisma.$transaction(async (tx) => {
    // 1. Check if sales order exists and is valid
    const salesOrder = await tx.salesOrder.findFirst({
      where: { id: data.salesOrder.connect?.id, deletedAt: null }
    });

    if (!salesOrder) {
      throw new ApiError(404, 'Sales Order not found');
    }

    // 2. Create invoice
    const invoice = await tx.invoice.create({
      data: {
        ...data,
        status: data.status || 'PENDING',
      }
    });

    return invoice;
  });
};

export const updateInvoiceStatus = async (id: string, status: InvoiceStatus) => {
  const invoice = await prisma.invoice.findFirst({ where: { id, deletedAt: null } });
  if (!invoice) {
    throw new ApiError(404, 'Invoice not found');
  }

  return prisma.invoice.update({
    where: { id },
    data: { status }
  });
};

export const deleteInvoice = async (id: string) => {
  const invoice = await prisma.invoice.findFirst({ where: { id, deletedAt: null } });
  if (!invoice) {
    throw new ApiError(404, 'Invoice not found');
  }

  return prisma.invoice.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
};
