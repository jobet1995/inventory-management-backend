import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/response';
import * as customerService from '../services/customer.service';

export const getCustomers = catchAsync(async (req: Request, res: Response) => {
  const customers = await customerService.getAllCustomers(req.query);
  sendResponse(res, 200, 'Customers fetched successfully', customers);
});

export const getCustomerById = catchAsync(async (req: Request, res: Response) => {
  const customer = await customerService.getCustomerById(req.params.id as string );
  sendResponse(res, 200, 'Customer fetched successfully', customer);
});

export const createCustomer = catchAsync(async (req: Request, res: Response) => {
  const customer = await customerService.createCustomer(req.body);
  sendResponse(res, 201, 'Customer created successfully', customer);
});

export const updateCustomer = catchAsync(async (req: Request, res: Response) => {
  const customer = await customerService.updateCustomer(req.params.id as string, req.body);
  sendResponse(res, 200, 'Customer updated successfully', customer);
});

export const deleteCustomer = catchAsync(async (req: Request, res: Response) => {
  await customerService.deleteCustomer(req.params.id as string);
  sendResponse(res, 204, 'Customer deleted successfully');
});
