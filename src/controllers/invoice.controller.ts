import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/response';
import * as invoiceService from '../services/invoice.service';

export const getInvoices = catchAsync(async (req: Request, res: Response) => {
  const invoices = await invoiceService.getAllInvoices(req.query);
  sendResponse(res, 200, 'Invoices fetched successfully', invoices);
});

export const getInvoiceById = catchAsync(async (req: Request, res: Response) => {
  const invoice = await invoiceService.getInvoiceById(req.params.id as string);
  sendResponse(res, 200, 'Invoice fetched successfully', invoice);
});

export const createInvoice = catchAsync(async (req: Request, res: Response) => {
  const invoice = await invoiceService.createInvoice(req.body);
  sendResponse(res, 201, 'Invoice created successfully', invoice);
});

export const updateInvoiceStatus = catchAsync(async (req: Request, res: Response) => {
  const invoice = await invoiceService.updateInvoiceStatus(req.params.id as string, req.body.status);
  sendResponse(res, 200, 'Invoice status updated', invoice);
});

export const deleteInvoice = catchAsync(async (req: Request, res: Response) => {
  await invoiceService.deleteInvoice(req.params.id as string);
  sendResponse(res, 204, 'Invoice deleted successfully');
});
