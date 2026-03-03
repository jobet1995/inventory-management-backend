import { Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { sendResponse } from '../utils/response';
import ApiError from '../utils/ApiError';
import * as authService from '../services/auth.service';

export const register = catchAsync(async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);
  sendResponse(res, 201, 'User registered successfully', user);
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = await authService.loginUser(email, password);
  sendResponse(res, 200, 'Login successful', data);
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  // Access currently logged in user
  const userId = req.user?.id;
  
  if (!userId) {
    throw new ApiError(401, 'Please log in to access this resource');
  }

  const user = await authService.getUserById(userId);
  sendResponse(res, 200, 'User profile fetched successfully', user);
});
