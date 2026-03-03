import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/response';
import * as salesReturnService from '../services/sales-return.service';

export const getSalesReturns = catchAsync(async (req: Request, res: Response) => {
  const returns = await salesReturnService.getAllSalesReturns(req.query);
  sendResponse(res, 200, 'Sales returns fetched successfully', returns);
});

export const getSalesReturnById = catchAsync(async (req: Request, res: Response) => {
  const salesReturn = await salesReturnService.getSalesReturnById(req.params.id as string);
  sendResponse(res, 200, 'Sales return fetched successfully', salesReturn);
});

export const createSalesReturn = catchAsync(async (req: Request, res: Response) => {
  const salesReturn = await salesReturnService.createSalesReturn(req.body);
  sendResponse(res, 201, 'Sales return created successfully', salesReturn);
});

export const updateSalesReturnStatus = catchAsync(async (req: Request, res: Response) => {
  const salesReturn = await salesReturnService.updateSalesReturnStatus(req.params.id as string, req.body.status);
  sendResponse(res, 200, 'Sales return status updated successfully', salesReturn);
});

export const deleteSalesReturn = catchAsync(async (req: Request, res: Response) => {
  await salesReturnService.deleteSalesReturn(req.params.id as string);
  sendResponse(res, 204, 'Sales return deleted successfully');
});
