import { Router } from 'express';
import { prisma } from './crud.js';
import { crudRouter } from './crud.js';
import { nestedItemsRouter } from './nestedItems.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();
router.use('/suppliers', crudRouter(prisma.supplier as any, ['name', 'email', 'phone', 'address', 'city', 'state', 'postalCode', 'country', 'contactPerson', 'paymentTerms']));
router.use('/purchase-orders', crudRouter(prisma.purchaseOrder as any, ['code', 'supplierId', 'warehouseId', 'status', 'subtotal', 'tax', 'total', 'orderDate', 'expectedDelivery']));
router.use('/goods-receipts', crudRouter(prisma.goodsReceipt as any, ['code', 'purchaseOrderId', 'warehouseId', 'status', 'receivedDate']));
router.use('/purchase-orders/:id/items', nestedItemsRouter({ parent: 'purchaseOrder', item: 'purchaseOrderItem', fields: ['productId', 'quantity', 'unitPrice', 'lineTotal'] }));
router.use('/goods-receipts/:id/items', nestedItemsRouter({ parent: 'goodsReceipt', item: 'goodsReceiptItem', fields: ['productId', 'receivedQuantity'] }));
router.post('/purchase-orders/:id/receive', validate(z.object({ warehouseId: z.string(), items: z.array(z.object({ productId: z.string(), receivedQuantity: z.coerce.number().positive() })) })), asyncHandler(async (req, res) => {
	const purchaseOrder = await prisma.purchaseOrder.findFirst({ where: { id: req.params.id, organizationId: req.organizationId } });
	if (!purchaseOrder) return res.status(404).json({ success: false, error: { message: 'Purchase order not found', statusCode: 404 } });
	const receipt = await prisma.$transaction(async (tx) => {
		const created = await tx.goodsReceipt.create({ data: { purchaseOrderId: purchaseOrder.id, warehouseId: req.body.warehouseId, status: 'RECEIVED', organizationId: req.organizationId!, items: { create: req.body.items } }, include: { items: true } });
		for (const item of req.body.items) {
			await tx.stock.upsert({ where: { productId_warehouseId: { productId: item.productId, warehouseId: req.body.warehouseId } }, create: { productId: item.productId, warehouseId: req.body.warehouseId, organizationId: req.organizationId!, quantity: item.receivedQuantity }, update: { quantity: { increment: item.receivedQuantity } } });
			await tx.stockMovement.create({ data: { productId: item.productId, warehouseId: req.body.warehouseId, type: 'PURCHASE', direction: 'IN', quantity: item.receivedQuantity, reference: purchaseOrder.code, purchaseOrderId: purchaseOrder.id, goodsReceiptId: created.id, organizationId: req.organizationId! } });
		}
		await tx.purchaseOrder.update({ where: { id: purchaseOrder.id }, data: { status: 'RECEIVED' } });
		return created;
	});
	return res.status(201).json({ success: true, data: receipt });
}));
export default router;