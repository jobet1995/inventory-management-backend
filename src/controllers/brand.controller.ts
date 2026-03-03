import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/response';
import * as brandService from '../services/brand.service';

export const getBrands = catchAsync(async (req: Request, res: Response) => {
  const brands = await brandService.getAllBrands(req.query);
  sendResponse(res, 200, 'Brands fetched successfully', brands);
});

export const getBrandById = catchAsync(async (req: Request, res: Response) => {
  const brand = await brandService.getBrandById(req.params.id as string);
  sendResponse(res, 200, 'Brand fetched successfully', brand);
});

export const createBrand = catchAsync(async (req: Request, res: Response) => {
  const brand = await brandService.createBrand(req.body);
  sendResponse(res, 201, 'Brand created successfully', brand);
});

export const updateBrand = catchAsync(async (req: Request, res: Response) => {
  const brand = await brandService.updateBrand(req.params.id as string, req.body);
  sendResponse(res, 200, 'Brand updated successfully', brand);
});

export const deleteBrand = catchAsync(async (req: Request, res: Response) => {
  await brandService.deleteBrand(req.params.id as string);
  sendResponse(res, 204, 'Brand deleted successfully');
});
