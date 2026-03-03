import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/response';
import * as userService from '../services/user.service';

export const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getAllUsers(req.query);
  sendResponse(res, 200, 'Users fetched successfully', users);
});

export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id as string);
  sendResponse(res, 200, 'User fetched successfully', user);
});

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  sendResponse(res, 201, 'User created successfully', user);
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUser(req.params.id as string, req.body);
  sendResponse(res, 200, 'User updated successfully', user);
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.id as string);
  sendResponse(res, 204, 'User deleted successfully');
});
