import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { config } from '../config/env.js';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

router.post('/login', validate(loginSchema), asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { email: req.body.email } });
  if (!user || !user.isActive || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ success: false, error: { message: 'Invalid email or password', statusCode: 401 } });
  }
  const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any });
  return res.json({ success: true, data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, organizationId: user.organizationId } } });
}));

router.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user!.id }, include: { organization: true } });
  return res.json({ success: true, data: user && { ...user, password: undefined } });
}));

export default router;