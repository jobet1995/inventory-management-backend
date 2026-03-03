import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';
import ApiError from '../utils/ApiError';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log(`\n🔍 [DEBUG] ${req.method} ${req.originalUrl}`);
    console.log(`📦 Body:`, JSON.stringify(req.body, null, 2));
    console.log(`❓ Query:`, JSON.stringify(req.query, null, 2));
    console.log(`📍 Params:`, JSON.stringify(req.params, null, 2));

    // 🛠️ SMART FIX: If user accidentally sends data in Query Params instead of Body
    if ((req.method === 'POST' || req.method === 'PUT') && 
        Object.keys(req.body || {}).length === 0 && 
        Object.keys(req.query || {}).length > 0) {
      console.log('💡 [INFO] Automatically moving Query Params to Body to fix Postman config issue.');
      req.body = { ...req.query };
    }

    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Safe check for the schema structure
        const bodyIsEmpty = Object.keys(req.body || {}).length === 0;
        const queryIsNotEmpty = Object.keys(req.query || {}).length > 0;

        let hint = '';
        if (bodyIsEmpty && queryIsNotEmpty) {
          hint = ' (Note: It looks like you sent data in the URL/Query Params, but this endpoint expects it in the Request Body JSON)';
        }

        const errorMessages = error.issues.map((issue: ZodIssue) => ({
          message: `${issue.path.join('.')} is ${issue.message}${hint}`,
        }));
        return next(new ApiError(400, 'Invalid input data', errorMessages));
      }
      next(error);
    }
  };
};
