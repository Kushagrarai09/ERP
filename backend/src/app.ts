import express, { Express } from 'express';
import { randomUUID } from 'crypto';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

export const createApp = (): Express => {
  const app = express();

  // Security middleware
  app.use(helmet());

  // Flexible CORS configuration for production deployment
  const allowedOrigins = (config.frontendUrl || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (
          allowedOrigins.includes('*') ||
          allowedOrigins.includes(origin) ||
          origin.endsWith('.vercel.app') ||
          config.nodeEnv !== 'production'
        ) {
          return callback(null, true);
        }
        return callback(null, true); // Allow origin in case of custom domains
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id'],
    })
  );

  // Body parsing middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Logging middleware
  app.use((req, res, next) => {
    const requestId = req.header('x-request-id') || randomUUID();
    res.setHeader('x-request-id', requestId);
    console.log(JSON.stringify({ timestamp: new Date().toISOString(), requestId, method: req.method, path: req.path }));
    next();
  });

  // API routes
  app.use('/api', routes);

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
};
