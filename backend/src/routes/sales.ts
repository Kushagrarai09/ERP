import { Router } from 'express';
import { z } from 'zod';
import { prisma } from './crud.js';
import { crudRouter } from './crud.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.js';

const router = Router();
router.use('/quotations', crudRouter(prisma.quotation as any, ['code', 'companyId', 'contactId', 'dealId', 'status', 'subtotal', 'tax', 'total', 'expiryDate']));
router.use('/orders', crudRouter(prisma.salesOrder as any, ['code', 'companyId', 'contactId', 'dealId', 'quotationId', 'status', 'subtotal', 'tax', 'total', 'orderDate', 'dueDate']));

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
export default router;