import { PrismaClient } from '@prisma/client';
import { createApp } from './app.js';
import { config } from './config/env.js';

const prisma = new PrismaClient();
const app = createApp();

let server: any;

const startServer = async () => {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL');

    // Start Express server
    server = app.listen(config.port, () => {
      console.log(`✅ ERP Backend is running on port ${config.port}`);
      console.log(`📍 Environment: ${config.nodeEnv}`);
      console.log(`🌐 Frontend URL: ${config.frontendUrl}`);
      console.log(`\n📚 API Documentation:`);
      console.log(`   Health Check: http://localhost:${config.port}/api/health`);
      console.log(`   Database Check: http://localhost:${config.port}/api/health/db\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      console.log('🛑 Server stopped');
      await prisma.$disconnect();
      console.log('🛑 Database connection closed');
      process.exit(0);
    });
  } else {
    await prisma.$disconnect();
    console.log('🛑 Database connection closed');
    process.exit(0);
  }

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('❌ Forced shutdown (timeout)');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();
