import { Router } from 'express';
import { z } from 'zod';
import { prisma } from './crud.js';
import { crudRouter } from './crud.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.js';

const router = Router();
router.use('/invoices', crudRouter(prisma.invoice as any, ['code', 'companyId', 'salesOrderId', 'status', 'subtotal', 'tax', 'total', 'paidAmount', 'outstandingAmount', 'issueDate', 'dueDate']));
router.use('/payments', crudRouter(prisma.payment as any, ['invoiceId', 'amount', 'method', 'transactionRef', 'paymentDate']));
router.use('/expenses', crudRouter(prisma.expense as any, ['category', 'amount', 'description', 'supplierId', 'expenseDate']));
router.use('/accounts', crudRouter(prisma.account as any, ['name', 'accountType', 'balance', 'description']));

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
export default router;