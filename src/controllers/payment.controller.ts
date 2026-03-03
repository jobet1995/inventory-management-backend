import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/response';
import * as paymentService from '../services/payment.service';

export const getPayments = catchAsync(async (req: Request, res: Response) => {
  const payments = await paymentService.getAllPayments(req.query);
  sendResponse(res, 200, 'Payments fetched successfully', payments);
});

export const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const payment = await paymentService.getPaymentById(req.params.id as string);
  sendResponse(res, 200, 'Payment fetched successfully', payment);
});

export const processPayment = catchAsync(async (req: Request, res: Response) => {
  const payment = await paymentService.processPayment(req.body);
  sendResponse(res, 201, 'Payment processed successfully', payment);
});
