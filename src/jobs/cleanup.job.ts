import prisma from '../config/database';
import { logger } from '../config/logger';

export const cleanupOldAuditLogs = async () => {
  try {
    logger.info('Running audit log cleanup job...');
    
    // Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Delete logs older than 30 days
    const result = await prisma.auditLog.deleteMany({
      where: {
        timestamp: {
          lt: thirtyDaysAgo
        }
      }
    });

    logger.info(`Successfully deleted ${result.count} old audit logs.`);

  } catch (error) {
    logger.error('Failed to run audit log cleanup job', { error });
  }
};
