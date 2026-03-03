import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/response';
import * as salesService from '../services/sales.service';

export const getSalesOrders = catchAsync(async (req: Request, res: Response) => {
  const orders = await salesService.getAllSalesOrders(req.query);
  sendResponse(res, 200, 'Sales orders fetched successfully', orders);
});

export const getSalesOrderById = catchAsync(async (req: Request, res: Response) => {
  const order = await salesService.getSalesOrderById(req.params.id as string);
  sendResponse(res, 200, 'Sales order fetched successfully', order);
});

export const createSalesOrder = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id || 'sys_temp';
  const order = await salesService.createSalesOrder({ ...req.body, createdById: userId });
  sendResponse(res, 201, 'Sales order created successfully', order);
});

export const updateSalesOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const order = await salesService.updateSalesOrderStatus(req.params.id as string, req.body.status);
  sendResponse(res, 200, 'Sales order status updated', order);
});
