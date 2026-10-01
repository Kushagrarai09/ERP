import { Router } from 'express';
import { z } from 'zod';
import { prisma } from './crud.js';
import { crudRouter } from './crud.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.js';

const router = Router();
router.use('/products', crudRouter(prisma.product as any, ['code', 'name', 'description', 'status', 'cost', 'sellingPrice', 'unit']));
router.use('/warehouses', crudRouter(prisma.warehouse as any, ['name', 'location', 'address', 'city', 'state']));
router.use('/stock', crudRouter(prisma.stock as any, ['productId', 'warehouseId', 'quantity', 'reservedQuantity']));
router.use('/stock-movements', crudRouter(prisma.stockMovement as any, ['productId', 'warehouseId', 'type', 'direction', 'quantity', 'reference', 'salesOrderId', 'purchaseOrderId', 'goodsReceiptId']));

router.post('/stock/move', validate(z.object({ productId: z.string(), warehouseId: z.string(), type: z.string(), direction: z.enum(['IN', 'OUT']), quantity: z.coerce.number().positive(), reference: z.string().optional() })), asyncHandler(async (req, res) => {
  const { productId, warehouseId, type, direction, quantity, reference } = req.body;
  const stock = await prisma.$transaction(async (tx) => {
    const current = await tx.stock.findFirst({ where: { productId, warehouseId, organizationId: req.organizationId } });
    const nextQuantity = Number(current?.quantity ?? 0) + (direction === 'IN' ? quantity : -quantity);
    if (nextQuantity < 0) throw Object.assign(new Error('Insufficient stock'), { statusCode: 409 });
    const updated = current ? await tx.stock.update({ where: { id: current.id }, data: { quantity: nextQuantity } }) : await tx.stock.create({ data: { productId, warehouseId, organizationId: req.organizationId!, quantity } });
    await tx.stockMovement.create({ data: { productId, warehouseId, type, direction, quantity, reference, organizationId: req.organizationId! } });
    return updated;
  });
  return res.status(201).json({ success: true, data: stock });
}));
export default router;