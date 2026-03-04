import { Request, Response } from 'express';
import prisma from '../config/database';
import os from 'os';

export const getSystemHealth = async (req: Request, res: Response) => {
  try {
    // Check DB Connection
    let dbStatus = 'DISCONNECTED';
    let dbLatency = 0;
    try {
      const start = performance.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatency = performance.now() - start;
      dbStatus = 'CONNECTED';
    } catch (dbError) {
      console.error('Database connection failed during health check:', dbError);
    }

    const memoryUsage = process.memoryUsage();
    
    // Format memory helper
    const formatBytes = (bytes: number) => {
      return (bytes / 1024 / 1024).toFixed(2) + ' MB';
    };

    const cpus = os.cpus();
    const cpuLoad = os.loadavg();

    const healthData = {
      status: 'UP',
      timestamp: new Date().toISOString(),
      uptime: {
        system: process.uptime(),
        os: os.uptime()
      },
      database: {
        status: dbStatus,
        latencyMs: Math.round(dbLatency * 100) / 100
      },
      system: {
        platform: os.platform(),
        release: os.release(),
        cpu: cpus[0]?.model || 'Unknown CPU',
        cpuCores: cpus.length,
        loadAverage: cpuLoad,
        totalMemory: formatBytes(os.totalmem()),
        freeMemory: formatBytes(os.freemem())
      },
      process: {
        nodeVersion: process.version,
        memoryUsage: {
          rss: formatBytes(memoryUsage.rss),
          heapTotal: formatBytes(memoryUsage.heapTotal),
          heapUsed: formatBytes(memoryUsage.heapUsed),
          external: formatBytes(memoryUsage.external)
        }
      }
    };

    res.status(200).json(healthData);
  } catch (error) {
    console.error('Error fetching system health:', error);
    res.status(500).json({ status: 'DOWN', error: 'Internal Server Error' });
  }
};
