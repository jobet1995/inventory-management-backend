import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/response';
import * as productService from '../services/product.service';

export const getProducts = catchAsync(async (req: Request, res: Response) => {
  const products = await productService.getAllProducts(req.query);
  sendResponse(res, 200, 'Products fetched successfully', products);
});

export const getProductById = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id as string);
  sendResponse(res, 200, 'Product fetched successfully', product);
});

export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);
  sendResponse(res, 201, 'Product created successfully', product);
});

export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const product = await productService.updateProduct(req.params.id as string, req.body);
  sendResponse(res, 200, 'Product updated successfully', product);
});

export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  await productService.deleteProduct(req.params.id as string);
  sendResponse(res, 204, 'Product deleted successfully');
});
