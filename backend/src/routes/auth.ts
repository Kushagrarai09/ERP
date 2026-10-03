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
const signupSchema = z.object({ organizationName: z.string().trim().min(2).max(120), organizationEmail: z.string().email(), name: z.string().trim().min(2).max(120), email: z.string().email(), password: z.string().min(8).max(128) });

router.post('/signup', validate(signupSchema), asyncHandler(async (req, res) => {
  const password = await bcrypt.hash(req.body.password, 12);
  try {
    const result = await prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({ data: { name: req.body.organizationName, email: req.body.organizationEmail } });
      const user = await tx.user.create({ data: { name: req.body.name, email: req.body.email, password, role: 'ADMIN', organizationId: organization.id } });
      const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any });
      return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, organizationId: user.organizationId } };
    });
    return res.status(201).json({ success: true, data: result });
  } catch (error: any) {
    if (error?.code === 'P2002') return res.status(409).json({ success: false, error: { message: 'Organization or user email already exists', statusCode: 409 } });
    throw error;
  }
}));

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

// Team / User Management (Scoped to Organization)
router.get('/users', requireAuth, asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    where: { organizationId: req.user!.organizationId },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  return res.json({ success: true, data: users });
}));

const createUserSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  role: z.enum(['ADMIN', 'MANAGER', 'SALES', 'INVENTORY', 'PROCUREMENT', 'FINANCE', 'VIEWER']).default('VIEWER'),
});

router.post('/users', requireAuth, validate(createUserSchema), asyncHandler(async (req, res) => {
  if (req.user!.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: { message: 'Only Admins can add team members', statusCode: 403 } });
  }

  const existing = await prisma.user.findUnique({ where: { email: req.body.email } });
  if (existing) {
    return res.status(409).json({ success: false, error: { message: 'A user with this email already exists', statusCode: 409 } });
  }

  const passwordHash = await bcrypt.hash(req.body.password, 12);
  const newUser = await prisma.user.create({
    data: {
      name: req.body.name,
      email: req.body.email,
      password: passwordHash,
      role: req.body.role,
      organizationId: req.user!.organizationId,
    },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  });

  return res.status(201).json({ success: true, data: newUser });
}));

const updateUserSchema = z.object({
  role: z.enum(['ADMIN', 'MANAGER', 'SALES', 'INVENTORY', 'PROCUREMENT', 'FINANCE', 'VIEWER']).optional(),
  isActive: z.boolean().optional(),
});

router.patch('/users/:id', requireAuth, validate(updateUserSchema), asyncHandler(async (req, res) => {
  if (req.user!.role !== 'ADMIN') {
    return res.status(403).json({ success: false, error: { message: 'Only Admins can update user roles', statusCode: 403 } });
  }

  const targetUser = await prisma.user.findUnique({ where: { id: req.params.id } });
  if (!targetUser || targetUser.organizationId !== req.user!.organizationId) {
    return res.status(404).json({ success: false, error: { message: 'User not found in your organization', statusCode: 404 } });
  }

  const updated = await prisma.user.update({
    where: { id: req.params.id },
    data: {
      ...(req.body.role ? { role: req.body.role } : {}),
      ...(typeof req.body.isActive === 'boolean' ? { isActive: req.body.isActive } : {}),
    },
    select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
  });

  return res.json({ success: true, data: updated });
}));

export default router;