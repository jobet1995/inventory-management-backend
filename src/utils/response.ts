import { Response } from 'express';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T,
  errors?: unknown
) => {
  const success = statusCode >= 200 && statusCode < 300;
  
  const response: Record<string, unknown> = {
    success,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  if (errors !== undefined) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};
