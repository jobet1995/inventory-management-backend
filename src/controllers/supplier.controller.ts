import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/response';
import * as supplierService from '../services/supplier.service';

export const getSuppliers = catchAsync(async (req: Request, res: Response) => {
  const suppliers = await supplierService.getAllSuppliers(req.query);
  sendResponse(res, 200, 'Suppliers fetched successfully', suppliers);
});

export const getSupplierById = catchAsync(async (req: Request, res: Response) => {
  const supplier = await supplierService.getSupplierById(req.params.id as string);
  sendResponse(res, 200, 'Supplier fetched successfully', supplier);
});

export const createSupplier = catchAsync(async (req: Request, res: Response) => {
  const supplier = await supplierService.createSupplier(req.body);
  sendResponse(res, 201, 'Supplier created successfully', supplier);
});

export const updateSupplier = catchAsync(async (req: Request, res: Response) => {
  const supplier = await supplierService.updateSupplier(req.params.id as string, req.body);
  sendResponse(res, 200, 'Supplier updated successfully', supplier);
});

export const deleteSupplier = catchAsync(async (req: Request, res: Response) => {
  await supplierService.deleteSupplier(req.params.id as string);
  sendResponse(res, 204, 'Supplier deleted successfully');
});
