import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { config } from '../config/env.js';
import { prisma } from '../lib/prisma.js';

type TokenPayload = { userId: string };

export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.header('authorization');
  if (!header?.startsWith('Bearer ')) {
    return next(Object.assign(new Error('Authentication required'), { statusCode: 401 }));
  }

  try {
    const payload = jwt.verify(header.slice(7), config.jwtSecret) as TokenPayload;
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user || !user.isActive) {
      return next(Object.assign(new Error('Invalid or inactive user'), { statusCode: 401 }));
    }
    req.user = { id: user.id, organizationId: user.organizationId, role: user.role };
    req.organizationId = user.organizationId;
    next();
  } catch {
    next(Object.assign(new Error('Invalid or expired token'), { statusCode: 401 }));
  }
};

export const requireRole = (...roles: UserRole[]) => (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(Object.assign(new Error('Insufficient permissions'), { statusCode: 403 }));
  }
  next();
};