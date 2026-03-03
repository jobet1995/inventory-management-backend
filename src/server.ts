import app from './app';
import prisma from './config/database';
import { initScheduler } from './jobs/scheduler';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    console.log('⏳ Connecting to Database...');
    await prisma.$connect();
    console.log('✅ Synchronized with Database via Prisma');

    console.log('🚀 Finalizing Server startup...');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🔗 Primary endpoint: http://localhost:${PORT}`);
    });

    // Initialize background cron jobs
    initScheduler();

    // Handle Graceful Shutdown
    process.on('SIGTERM', () => {
      console.log('🔄 SIGTERM received. Shutting down gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('🛑 Server closed and database connection terminated.');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('🔄 SIGINT received. Shutting down gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('🛑 Server closed and database connection terminated.');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: unknown) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  if (err instanceof Error) {
    console.error(err.name, err.message);
  } else {
    console.error(err);
  }
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: unknown) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  if (err instanceof Error) {
    console.error(err.name, err.message);
  } else {
    console.error(err);
  }
  process.exit(1);
});
