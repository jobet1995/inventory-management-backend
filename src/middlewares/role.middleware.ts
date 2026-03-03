import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import { Role } from '@prisma/client';

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return next(new ApiError(401, 'User not authenticated or role missing'));
    }

    if (!roles.includes(userRole)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }

    next();
  };
};
