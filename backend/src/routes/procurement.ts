import { Router } from 'express';
import { prisma } from './crud.js';
import { crudRouter } from './crud.js';

const router = Router();
router.use('/suppliers', crudRouter(prisma.supplier as any, ['name', 'email', 'phone', 'address', 'city', 'state', 'postalCode', 'country', 'contactPerson', 'paymentTerms']));
router.use('/purchase-orders', crudRouter(prisma.purchaseOrder as any, ['code', 'supplierId', 'warehouseId', 'status', 'subtotal', 'tax', 'total', 'orderDate', 'expectedDelivery']));
router.use('/goods-receipts', crudRouter(prisma.goodsReceipt as any, ['code', 'purchaseOrderId', 'warehouseId', 'status', 'receivedDate']));
export default router;