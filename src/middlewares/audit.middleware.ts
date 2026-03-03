import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { AuditLogAction, AuditLogEntity } from '@prisma/client';

export const auditLog = (action: AuditLogAction, entity: AuditLogEntity) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // We hook into the response finish event to capture the result of the action
    res.on('finish', async () => {
      // Only log if the action was successful (e.g. 200, 201)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const userId = req.user?.id;
        
        // Ensure we have a user (some public routes might not, though audit is usually for protected routes)
        if (!userId) return;

        // Try extracting entityId from params, body, or response
        // In a real app, you might attach created entities to res.locals
        let entityId = req.params.id || req.body.id || (res.locals.entityId as string) || 'UNKNOWN';

        try {
          await prisma.auditLog.create({
            data: {
              userId,
              action,
              entity,
              entityId,
              details: {
                method: req.method,
                endpoint: req.originalUrl,
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                // Be careful not to log sensitive data like passwords
                bodySnippet: req.body ? { ...req.body, password: undefined } : undefined
              }
            }
          });
        } catch (error) {
          console.error('Failed to write audit log:', error);
        }
      }
    });

    next();
  };
};
