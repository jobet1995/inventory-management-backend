import cron from 'node-cron';
import { logger } from '../config/logger';
import { checkLowStock } from './stock-alert.job';
import { cleanupOldAuditLogs } from './cleanup.job';

export const initScheduler = () => {
  logger.info('Initializing job scheduler...');

  // 1. Low Stock Alert Job: Runs every day at 08:00 AM
  cron.schedule('0 8 * * *', () => {
    checkLowStock();
  });

  // 2. Audit Log Cleanup Job: Runs every Sunday at Midnight
  cron.schedule('0 0 * * 0', () => {
    cleanupOldAuditLogs();
  });

  logger.info('Scheduler initialized with registered cron jobs.');
};
