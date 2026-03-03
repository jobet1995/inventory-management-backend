import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/response';
import * as purchaseReturnService from '../services/purchase-return.service';

export const getPurchaseReturns = catchAsync(async (req: Request, res: Response) => {
  const returns = await purchaseReturnService.getAllPurchaseReturns(req.query);
  sendResponse(res, 200, 'Purchase returns fetched successfully', returns);
});

export const getPurchaseReturnById = catchAsync(async (req: Request, res: Response) => {
  const purchaseReturn = await purchaseReturnService.getPurchaseReturnById(req.params.id as string);
  sendResponse(res, 200, 'Purchase return fetched successfully', purchaseReturn);
});

export const createPurchaseReturn = catchAsync(async (req: Request, res: Response) => {
  const purchaseReturn = await purchaseReturnService.createPurchaseReturn(req.body);
  sendResponse(res, 201, 'Purchase return created successfully', purchaseReturn);
});

export const updatePurchaseReturnStatus = catchAsync(async (req: Request, res: Response) => {
  const purchaseReturn = await purchaseReturnService.updatePurchaseReturnStatus(req.params.id as string, req.body.status);
  sendResponse(res, 200, 'Purchase return status updated successfully', purchaseReturn);
});

export const deletePurchaseReturn = catchAsync(async (req: Request, res: Response) => {
  await purchaseReturnService.deletePurchaseReturn(req.params.id as string);
  sendResponse(res, 204, 'Purchase return deleted successfully');
});
