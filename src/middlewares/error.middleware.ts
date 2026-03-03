import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { Prisma } from '@prisma/client';
import ApiError from '../utils/ApiError';
import { sendResponse } from '../utils/response';

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: unknown = undefined;

  console.error('💥 ERROR:', err);

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Handling Prisma Errors
    if (err.code === 'P2002') {
      statusCode = 409;
      message = 'Duplicate field value entered';
      errors = err.meta?.target;
    } else if (err.code === 'P2025') {
      statusCode = 404;
      message = 'Record not found';
    } else {
      statusCode = 400;
      message = 'Database Error';
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = 'Validation Error in Database Query';
  }

  // Add more specific error types (like Zod validation) as needed

  // Professional HTML Error Response for Browsers
  if (req.accepts('html')) {
    const publicPath = path.join(__dirname, '../../public');
    if (statusCode === 404) {
      return res.status(404).sendFile(path.join(publicPath, '404.html'));
    }
    if (statusCode >= 500) {
      return res.status(500).sendFile(path.join(publicPath, '500.html'));
    }
  }

  if (process.env.NODE_ENV === 'development') {
    return sendResponse(res, statusCode, message, { stack: err.stack }, errors);
  }

  sendResponse(res, statusCode, message, undefined, errors);
};
