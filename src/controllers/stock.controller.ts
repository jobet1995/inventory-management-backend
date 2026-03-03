import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/response';
import * as stockService from '../services/stock.service';

export const getStocks = catchAsync(async (req: Request, res: Response) => {
  const stocks = await stockService.getAllStocks(req.query);
  sendResponse(res, 200, 'Stocks fetched successfully', stocks);
});

export const getStockById = catchAsync(async (req: Request, res: Response) => {
  const stock = await stockService.getStockById(req.params.id as string);
  sendResponse(res, 200, 'Stock fetched successfully', stock);
});

export const adjustStock = catchAsync(async (req: Request, res: Response) => {
  const movement = await stockService.adjustStock(req.body);
  sendResponse(res, 201, 'Stock adjusted successfully', movement);
});

export const getStockMovements = catchAsync(async (req: Request, res: Response) => {
  const movements = await stockService.getStockMovements(req.query);
  sendResponse(res, 200, 'Stock movements fetched successfully', movements);
});
