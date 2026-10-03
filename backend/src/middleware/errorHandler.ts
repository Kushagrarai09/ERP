import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';

interface ApiError extends Error {
  statusCode?: number;
  details?: unknown;
  message: string;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error(`[ERROR] ${statusCode}: ${message}`);
  console.error(err.stack);

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      ...(config.isDevelopment && { stack: err.stack }),
      ...(err.details ? { details: err.details } : {}),
      requestId: res.getHeader('x-request-id') || req.header('x-request-id'),
    },
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      statusCode: 404,
    },
  });
};
