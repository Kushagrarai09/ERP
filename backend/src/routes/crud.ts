import { RequestHandler, Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate, validateParams } from '../middleware/validate.js';

type Delegate = {
  findMany: (args: any) => Promise<unknown[]>;
  findUnique: (args: any) => Promise<unknown | null>;
  create: (args: any) => Promise<unknown>;
  update: (args: any) => Promise<unknown>;
  delete: (args: any) => Promise<unknown>;
};

const cleanData = (body: Record<string, unknown>, fields: string[]) =>
  Object.fromEntries(fields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]));

export const crudRouter = (delegate: Delegate, fields: string[], options: { include?: object } = {}): Router => {
  const router = Router();
  const bodySchema = z.record(z.string(), z.unknown());

  router.get('/', asyncHandler(async (req, res) => {
    const organizationId = req.organizationId as string;
    const records = await delegate.findMany({
      where: { organizationId, ...(typeof req.query.status === 'string' ? { status: req.query.status } : {}) },
      include: options.include,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: records });
  }));

  router.get('/:id', validateParams(z.object({ id: z.string().min(1) })), asyncHandler(async (req, res) => {
    const record = await delegate.findUnique({ where: { id: req.params.id } });
    if (!record || (record as { organizationId?: string }).organizationId !== req.organizationId) {
      return res.status(404).json({ success: false, error: { message: 'Resource not found', statusCode: 404 } });
    }
    return res.json({ success: true, data: record });
  }));

  router.post('/', validate(bodySchema), asyncHandler(async (req, res) => {
    const record = await delegate.create({ data: { ...cleanData(req.body, fields), organizationId: req.organizationId }, include: options.include });
    res.status(201).json({ success: true, data: record });
  }));

  router.patch('/:id', validate(bodySchema), asyncHandler(async (req, res) => {
    const existing = await delegate.findUnique({ where: { id: req.params.id } });
    if (!existing || (existing as { organizationId?: string }).organizationId !== req.organizationId) {
      return res.status(404).json({ success: false, error: { message: 'Resource not found', statusCode: 404 } });
    }
    const record = await delegate.update({ where: { id: req.params.id }, data: cleanData(req.body, fields), include: options.include });
    return res.json({ success: true, data: record });
  }));

  router.delete('/:id', asyncHandler(async (req, res) => {
    const existing = await delegate.findUnique({ where: { id: req.params.id } });
    if (!existing || (existing as { organizationId?: string }).organizationId !== req.organizationId) {
      return res.status(404).json({ success: false, error: { message: 'Resource not found', statusCode: 404 } });
    }
    await delegate.delete({ where: { id: req.params.id } });
    return res.status(204).send();
  }));
  return router;
};

export const withAuth = (router: Router, auth: RequestHandler): Router => {
  router.use(auth);
  return router;
};

export { prisma };