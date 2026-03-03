import prisma from '../config/database';
import ApiError from '../utils/ApiError';
import { Prisma } from '@prisma/client';

export const getAllPayments = async (query?: Prisma.PaymentFindManyArgs) => {
  return prisma.payment.findMany({
    where: { deletedAt: null, ...query?.where },
    include: {
      invoice: { select: { invoiceNumber: true, totalAmount: true } }
    },
    ...query
  });
};

export const getPaymentById = async (id: string) => {
  const payment = await prisma.payment.findFirst({
    where: { id, deletedAt: null },
    include: {
      invoice: { select: { invoiceNumber: true, totalAmount: true } }
    }
  });

  if (!payment) {
    throw new ApiError(404, 'Payment not found');
  }

  return payment;
};

export const processPayment = async (data: Prisma.PaymentUncheckedCreateInput) => {
  return prisma.$transaction(async (tx: any) => {
    if (!data.invoiceId) {
      throw new ApiError(400, 'Invoice ID is required for payment');
    }

    // 1. Verify invoice
    const invoice = await tx.invoice.findFirst({
      where: { id: data.invoiceId, deletedAt: null },
      include: { payments: { where: { deletedAt: null } } }
    });

    if (!invoice) {
      throw new ApiError(404, 'Invoice not found');
    }

    // 2. Validate amount
    const totalPaidSoFar = invoice.payments.reduce((sum: number, p: any) => sum + Number(p.amount), 0);
    const amountToPay = Number(data.amount);
    const balance = Number(invoice.totalAmount) - totalPaidSoFar;

    if (amountToPay > balance) {
      throw new ApiError(400, `Payment amount (${amountToPay}) exceeds remaining balance (${balance})`);
    }

    // 3. Create payment
    const payment = await tx.payment.create({
      data: {
        ...data,
        orderId: invoice.salesOrderId,
        type: 'SALES'
      }
    });

    // 4. Update invoice status
    const newTotalPaid = totalPaidSoFar + amountToPay;
    let newStatus = invoice.status;
    
    if (newTotalPaid >= Number(invoice.totalAmount)) {
      newStatus = 'PAID';
    } else if (newTotalPaid > 0) {
      // The schema only has DRAFT, PENDING, PAID, OVERDUE, CANCELLED.
      // We will keep it as PENDING if it's partially paid.
      newStatus = 'PENDING';
    }

    if (newStatus !== invoice.status) {
      await tx.invoice.update({
        where: { id: invoice.id },
        data: { status: newStatus }
      });
    }

    return payment;
  });
};
