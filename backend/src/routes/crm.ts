import { Router } from 'express';
import { prisma } from './crud.js';
import { crudRouter } from './crud.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();
router.use('/companies', crudRouter(prisma.company as any, ['name', 'email', 'phone', 'address', 'city', 'state', 'postalCode', 'country', 'industry', 'employeeCount', 'revenue', 'website', 'ownerName']));
router.use('/contacts', crudRouter(prisma.contact as any, ['firstName', 'lastName', 'email', 'phone', 'title', 'department', 'companyId']));
router.use('/leads', crudRouter(prisma.lead as any, ['title', 'email', 'phone', 'status', 'companyId', 'contactId', 'source', 'budget']));
router.use('/deals', crudRouter(prisma.deal as any, ['title', 'value', 'probability', 'stage', 'expectedCloseDate', 'companyId', 'contactId'], { include: { company: true, contact: true } }));
router.use('/activities', crudRouter(prisma.activity as any, ['title', 'description', 'type', 'dueDate', 'completedDate', 'dealId']));
router.post('/leads/:id/convert', validate(z.object({ createCompany: z.boolean().default(true), createContact: z.boolean().default(true), createDeal: z.boolean().default(true), industry: z.string().optional(), contactTitle: z.string().optional(), dealName: z.string().optional(), dealValue: z.coerce.number().nonnegative().default(0) })), asyncHandler(async (req, res) => {
	const lead = await prisma.lead.findFirst({ where: { id: req.params.id, organizationId: req.organizationId } });
	if (!lead) return res.status(404).json({ success: false, error: { message: 'Lead not found', statusCode: 404 } });
	const result = await prisma.$transaction(async (tx) => {
		const company = req.body.createCompany ? await tx.company.create({ data: { name: lead.title, email: lead.email, phone: lead.phone, industry: req.body.industry, organizationId: req.organizationId! } }) : null;
		const contact = req.body.createContact && company ? await tx.contact.create({ data: { firstName: lead.title.split(' ')[0] || lead.title, lastName: lead.title.split(' ').slice(1).join(' '), email: lead.email, phone: lead.phone, title: req.body.contactTitle, companyId: company.id, organizationId: req.organizationId! } }) : null;
		const deal = req.body.createDeal && company ? await tx.deal.create({ data: { title: req.body.dealName || `${lead.title} Deal`, value: req.body.dealValue, companyId: company.id, contactId: contact?.id, organizationId: req.organizationId! } }) : null;
		await tx.lead.update({ where: { id: lead.id }, data: { status: 'CONVERTED', companyId: company?.id, contactId: contact?.id } });
		await tx.activity.create({ data: { title: `Converted lead: ${lead.title}`, description: 'Lead conversion completed', type: 'NOTE', completedDate: new Date(), organizationId: req.organizationId!, dealId: deal?.id } });
		return { company, contact, deal };
	});
	return res.status(201).json({ success: true, data: result });
}));
export default router;