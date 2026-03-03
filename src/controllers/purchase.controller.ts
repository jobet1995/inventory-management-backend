import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/response';
import * as purchaseService from '../services/purchase.service';

export const getPurchaseOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await purchaseService.getAllPurchaseOrders(req.query);
  sendResponse(res, 200, 'Purchase orders fetched successfully', orders);
});

export const getPurchaseOrderById = catchAsync(async (req: Request, res: Response) => {
  const order = await purchaseService.getPurchaseOrderById(req.params.id as string);
  sendResponse(res, 200, 'Purchase order fetched successfully', order);
});

export const createPurchaseOrder = catchAsync(async (req: Request, res: Response) => {
  // Assume user ID comes from auth middleware
  const userId = req.user?.id || 'sys_temp'; 
  const order = await purchaseService.createPurchaseOrder({ ...req.body, createdById: userId });
  sendResponse(res, 201, 'Purchase order created successfully', order);
});

export const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const order = await purchaseService.updateOrderStatus(req.params.id as string, req.body.status);
  sendResponse(res, 200, 'Purchase order status updated', order);
});
