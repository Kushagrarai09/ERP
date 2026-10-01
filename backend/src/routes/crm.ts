import { Router } from 'express';
import { prisma } from './crud.js';
import { crudRouter } from './crud.js';

const router = Router();
router.use('/companies', crudRouter(prisma.company as any, ['name', 'email', 'phone', 'address', 'city', 'state', 'postalCode', 'country', 'industry', 'employeeCount', 'revenue', 'website', 'ownerName']));
router.use('/contacts', crudRouter(prisma.contact as any, ['firstName', 'lastName', 'email', 'phone', 'title', 'department', 'companyId']));
router.use('/leads', crudRouter(prisma.lead as any, ['title', 'email', 'phone', 'status', 'companyId', 'contactId', 'source', 'budget']));
router.use('/deals', crudRouter(prisma.deal as any, ['title', 'value', 'probability', 'stage', 'expectedCloseDate', 'companyId', 'contactId'], { include: { company: true, contact: true } }));
router.use('/activities', crudRouter(prisma.activity as any, ['title', 'description', 'type', 'dueDate', 'completedDate', 'dealId']));
export default router;