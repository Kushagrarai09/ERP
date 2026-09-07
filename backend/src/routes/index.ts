import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { config } from '../config/env.js';

const router = Router();
const prisma = new PrismaClient();

// Health check - Basic API status
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'ERP API is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Health check - Database connection
router.get('/health/db', async (_req: Request, res: Response) => {
  try {
    // Attempt to query the database
    await prisma.$queryRaw`SELECT 1 as ping`;
    
    res.json({
      success: true,
      message: 'Database connection successful',
      database: 'PostgreSQL',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Database connection failed:', error);
    res.status(503).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
