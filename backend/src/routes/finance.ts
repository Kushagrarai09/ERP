import { Router } from 'express';
import { z } from 'zod';
import { prisma } from './crud.js';
import { crudRouter } from './crud.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { nestedItemsRouter } from './nestedItems.js';

const router = Router();
router.use('/invoices', crudRouter(prisma.invoice as any, ['code', 'companyId', 'salesOrderId', 'status', 'subtotal', 'tax', 'total', 'paidAmount', 'outstandingAmount', 'issueDate', 'dueDate']));
router.use('/payments', crudRouter(prisma.payment as any, ['invoiceId', 'amount', 'method', 'transactionRef', 'paymentDate']));
router.use('/expenses', crudRouter(prisma.expense as any, ['category', 'amount', 'description', 'supplierId', 'expenseDate']));
router.use('/accounts', crudRouter(prisma.account as any, ['name', 'accountType', 'balance', 'description']));
router.use('/invoices/:id/items', nestedItemsRouter({ parent: 'invoice', item: 'invoiceItem', fields: ['productId', 'quantity', 'unitPrice', 'lineTotal'] }));

router.post('/payments/record', validate(z.object({ invoiceId: z.string(), amount: z.coerce.number().positive(), method: z.string(), transactionRef: z.string().optional(), paymentDate: z.coerce.date().optional() })), asyncHandler(async (req, res) => {
  const payment = await prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.findFirst({ where: { id: req.body.invoiceId, organizationId: req.organizationId } });
    if (!invoice) throw Object.assign(new Error('Invoice not found'), { statusCode: 404 });
    const created = await tx.payment.create({ data: { ...req.body, organizationId: req.organizationId! } });
    const paidAmount = Number(invoice.paidAmount) + req.body.amount;
    await tx.invoice.update({ where: { id: invoice.id }, data: { paidAmount, outstandingAmount: Number(invoice.total) - paidAmount, status: paidAmount >= Number(invoice.total) ? 'PAID' : 'PARTIAL_PAID' } });
    return created;
  });
  return res.status(201).json({ success: true, data: payment });
}));

router.post('/orders/:id/convert-to-invoice', asyncHandler(async (req, res) => {
  const order = await prisma.salesOrder.findFirst({ where: { id: req.params.id, organizationId: req.organizationId }, include: { items: true } });
  if (!order) return res.status(404).json({ success: false, error: { message: 'Sales order not found', statusCode: 404 } });
  const invoice = await prisma.invoice.create({ data: { companyId: order.companyId, salesOrderId: order.id, subtotal: order.subtotal, tax: order.tax, total: order.total, outstandingAmount: order.total, organizationId: req.organizationId!, items: { create: order.items.map(({ productId, quantity, unitPrice, lineTotal }) => ({ productId, quantity, unitPrice, lineTotal })) } }, include: { items: true } });
  return res.status(201).json({ success: true, data: invoice });
}));
export default router;