import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/response';
import * as taxRateService from '../services/tax-rate.service';

export const getTaxRates = catchAsync(async (req: Request, res: Response) => {
  const taxRates = await taxRateService.getAllTaxRates(req.query);
  sendResponse(res, 200, 'Tax rates fetched successfully', taxRates);
});

export const getTaxRateById = catchAsync(async (req: Request, res: Response) => {
  const taxRate = await taxRateService.getTaxRateById(req.params.id as string);
  sendResponse(res, 200, 'Tax rate fetched successfully', taxRate);
});

export const createTaxRate = catchAsync(async (req: Request, res: Response) => {
  const taxRate = await taxRateService.createTaxRate(req.body);
  sendResponse(res, 201, 'Tax rate created successfully', taxRate);
});

export const updateTaxRate = catchAsync(async (req: Request, res: Response) => {
  const taxRate = await taxRateService.updateTaxRate(req.params.id as string, req.body);
  sendResponse(res, 200, 'Tax rate updated successfully', taxRate);
});

export const deleteTaxRate = catchAsync(async (req: Request, res: Response) => {
  await taxRateService.deleteTaxRate(req.params.id as string);
  sendResponse(res, 204, 'Tax rate deleted successfully');
});
