import { Router, Request, Response } from 'express';
import { config } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import authRouter from './auth.js';
import crmRouter from './crm.js';
import salesRouter from './sales.js';
import inventoryRouter from './inventory.js';
import procurementRouter from './procurement.js';
import financeRouter from './finance.js';

const router = Router();

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

router.use('/auth', authRouter);
router.use(requireAuth);
router.use('/', crmRouter);
router.use('/', salesRouter);
router.use('/', inventoryRouter);
router.use('/', procurementRouter);
router.use('/', financeRouter);

export default router;
