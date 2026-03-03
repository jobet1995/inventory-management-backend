import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/response';
import * as categoryService from '../services/category.service';

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  sendResponse(res, 200, 'Categories fetched successfully', categories);
});

export const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.getCategoryById(req.params.id as string);
  sendResponse(res, 200, 'Category fetched successfully', category);
});

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  sendResponse(res, 201, 'Category created successfully', category);
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const category = await categoryService.updateCategory(req.params.id as string, req.body);
  sendResponse(res, 200, 'Category updated successfully', category);
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  await categoryService.deleteCategory(req.params.id as string);
  sendResponse(res, 204, 'Category deleted successfully');
});
