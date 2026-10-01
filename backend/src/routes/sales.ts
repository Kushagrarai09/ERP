import { Router } from 'express';
import { z } from 'zod';
import { prisma } from './crud.js';
import { crudRouter } from './crud.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { nestedItemsRouter } from './nestedItems.js';

const router = Router();
router.use('/quotations', crudRouter(prisma.quotation as any, ['code', 'companyId', 'contactId', 'dealId', 'status', 'subtotal', 'tax', 'total', 'expiryDate']));
router.use('/orders', crudRouter(prisma.salesOrder as any, ['code', 'companyId', 'contactId', 'dealId', 'quotationId', 'status', 'subtotal', 'tax', 'total', 'orderDate', 'dueDate']));
router.use('/quotations/:id/items', nestedItemsRouter({ parent: 'quotation', item: 'quotationItem', fields: ['productId', 'quantity', 'unitPrice', 'lineTotal'] }));
router.use('/orders/:id/items', nestedItemsRouter({ parent: 'salesOrder', item: 'salesOrderItem', fields: ['productId', 'quantity', 'unitPrice', 'lineTotal'] }));

router.post('/deals/:id/convert-to-quotation', validate(z.object({ subtotal: z.coerce.number().nonnegative(), tax: z.coerce.number().nonnegative().default(0), total: z.coerce.number().nonnegative(), expiryDate: z.coerce.date().optional() })), asyncHandler(async (req, res) => {
  const deal = await prisma.deal.findFirst({ where: { id: req.params.id, organizationId: req.organizationId } });
  if (!deal) return res.status(404).json({ success: false, error: { message: 'Deal not found', statusCode: 404 } });
  const quotation = await prisma.$transaction(async (tx) => {
    const created = await tx.quotation.create({ data: { ...req.body, companyId: deal.companyId, contactId: deal.contactId, dealId: deal.id, organizationId: req.organizationId! } });
    await tx.deal.update({ where: { id: deal.id }, data: { stage: 'PROPOSAL' } });
    return created;
  });
  return res.status(201).json({ success: true, data: quotation });
}));

router.post('/quotations/:id/convert-to-order', asyncHandler(async (req, res) => {
  const quotation = await prisma.quotation.findFirst({ where: { id: req.params.id, organizationId: req.organizationId }, include: { items: true } });
  if (!quotation) return res.status(404).json({ success: false, error: { message: 'Quotation not found', statusCode: 404 } });
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.salesOrder.create({ data: { companyId: quotation.companyId, contactId: quotation.contactId, dealId: quotation.dealId, quotationId: quotation.id, status: 'CONFIRMED', subtotal: quotation.subtotal, tax: quotation.tax, total: quotation.total, organizationId: req.organizationId!, items: { create: quotation.items.map(({ productId, quantity, unitPrice, lineTotal }) => ({ productId, quantity, unitPrice, lineTotal })) } }, include: { items: true } });
    await tx.quotation.update({ where: { id: quotation.id }, data: { status: 'CONVERTED' } });
    return created;
  });
  return res.status(201).json({ success: true, data: order });
}));
export default router;