import { Request, Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.js';

type ItemConfig = {
  parent: 'quotation' | 'salesOrder' | 'purchaseOrder' | 'goodsReceipt' | 'invoice';
  item: 'quotationItem' | 'salesOrderItem' | 'purchaseOrderItem' | 'goodsReceiptItem' | 'invoiceItem';
  parentId: string;
  fields: string[];
};

const getParent = async (request: Request, config: ItemConfig) => {
  const delegate = (prisma as any)[config.parent];
  return delegate.findFirst({ where: { id: config.parentId, organizationId: request.organizationId } });
};

export const nestedItemsRouter = (config: Omit<ItemConfig, 'parentId'>): Router => {
  const router = Router();
  const schema = z.record(z.string(), z.unknown());
  router.post('/', validate(schema), asyncHandler(async (req, res) => {
    const parent = await getParent(req, { ...config, parentId: req.params.id });
    if (!parent) return res.status(404).json({ success: false, error: { message: 'Parent resource not found', statusCode: 404 } });
    const data = Object.fromEntries(config.fields.filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]]));
    const item = await (prisma as any)[config.item].create({ data: { ...data, [`${config.parent}Id`]: req.params.id } });
    return res.status(201).json({ success: true, data: item });
  }));
  return router;
};