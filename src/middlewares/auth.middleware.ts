import { Request, Response, NextFunction } from 'express';
import ApiError from '../utils/ApiError';
import prisma from '../config/database';
import { verifyToken } from '../utils/jwt';
import jwt from 'jsonwebtoken';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(new ApiError(401, 'You are not logged in! Please log in to get access.'));
    }

    // Verify token using our utility
    const decoded = verifyToken(token);

    // Check if user still exists
    const currentUser = await prisma.user.findFirst({
      where: { id: decoded.id, deletedAt: null }
    });

    if (!currentUser) {
      return next(new ApiError(401, 'The user belonging to this token does no longer exist.'));
    }

    // Check if user changed password after the token was issued
    // (Optional: Implement if you have a passwordChangedAt field)

    // Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, 'Invalid token. Please log in again!'));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Your token has expired! Please log in again.'));
    }
    next(error);
  }
};
