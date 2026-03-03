import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/response';
import * as warehouseService from '../services/warehouse.service';

export const getWarehouses = catchAsync(async (req: Request, res: Response) => {
  const warehouses = await warehouseService.getAllWarehouses(req.query);
  sendResponse(res, 200, 'Warehouses fetched successfully', warehouses);
});

export const getWarehouseById = catchAsync(async (req: Request, res: Response) => {
  const warehouse = await warehouseService.getWarehouseById(req.params.id as string);
  sendResponse(res, 200, 'Warehouse fetched successfully', warehouse);
});

export const createWarehouse = catchAsync(async (req: Request, res: Response) => {
  const warehouse = await warehouseService.createWarehouse(req.body);
  sendResponse(res, 201, 'Warehouse created successfully', warehouse);
});

export const updateWarehouse = catchAsync(async (req: Request, res: Response) => {
  const warehouse = await warehouseService.updateWarehouse(req.params.id as string, req.body);
  sendResponse(res, 200, 'Warehouse updated successfully', warehouse);
});

export const deleteWarehouse = catchAsync(async (req: Request, res: Response) => {
  await warehouseService.deleteWarehouse(req.params.id as string);
  sendResponse(res, 204, 'Warehouse deleted successfully');
});
