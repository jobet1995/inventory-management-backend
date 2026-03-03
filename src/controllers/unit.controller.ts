import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/response';
import * as unitService from '../services/unit.service';

export const getUnits = catchAsync(async (req: Request, res: Response) => {
  const units = await unitService.getAllUnits(req.query);
  sendResponse(res, 200, 'Units fetched successfully', units);
});

export const getUnitById = catchAsync(async (req: Request, res: Response) => {
  const unit = await unitService.getUnitById(req.params.id as string);
  sendResponse(res, 200, 'Unit fetched successfully', unit);
});

export const createUnit = catchAsync(async (req: Request, res: Response) => {
  const unit = await unitService.createUnit(req.body);
  sendResponse(res, 201, 'Unit created successfully', unit);
});

export const updateUnit = catchAsync(async (req: Request, res: Response) => {
  const unit = await unitService.updateUnit(req.params.id as string, req.body);
  sendResponse(res, 200, 'Unit updated successfully', unit);
});

export const deleteUnit = catchAsync(async (req: Request, res: Response) => {
  await unitService.deleteUnit(req.params.id as string);
  sendResponse(res, 204, 'Unit deleted successfully');
});
