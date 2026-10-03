import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Deal } from '../../types/crm';
import { OrderStatus, Quotation, QuotationStatus, SalesItem, SalesOrder } from '../../types/sales';

interface SalesContextType {
  quotations: Quotation[]; orders: SalesOrder[]; loading: boolean; error: string | null; reload: () => Promise<void>;
  addQuotation: (quotation: Omit<Quotation, 'id' | 'code' | 'createdAt'>) => Promise<Quotation | undefined>;
  updateQuotation: (id: string, fields: Partial<Quotation>) => Promise<void>;
  updateQuotationStatus: (id: string, status: QuotationStatus) => Promise<void>;
  deleteQuotation: (id: string) => Promise<void>;
  convertDealToQuotation: (deal: Deal) => Promise<Quotation | undefined>;
  addOrder: (order: Omit<SalesOrder, 'id' | 'code' | 'orderDate'>) => Promise<SalesOrder | undefined>;
  updateOrder: (id: string, fields: Partial<SalesOrder>) => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  convertQuotationToOrder: (quotation: Quotation) => Promise<SalesOrder | undefined>;
}
const SalesContext = createContext<SalesContextType | undefined>(undefined);
const quotationStatus: Record<string, string> = { draft: 'DRAFT', sent: 'SENT', accepted: 'ACCEPTED', rejected: 'REJECTED' };
const orderStatus: Record<string, string> = { pending: 'DRAFT', confirmed: 'CONFIRMED', processing: 'PARTIAL', completed: 'COMPLETED' };
const fromQuotationStatus: Record<string, QuotationStatus> = { DRAFT: 'draft', SENT: 'sent', ACCEPTED: 'accepted', REJECTED: 'rejected' };
const fromOrderStatus: Record<string, OrderStatus> = { DRAFT: 'pending', CONFIRMED: 'confirmed', PARTIAL: 'processing', FULFILLED: 'completed', COMPLETED: 'completed' };
const mapItem = (item: any): SalesItem => ({ id: item.id, productId: item.productId, productName: item.product?.name || item.productId, quantity: Number(item.quantity), unitPrice: Number(item.unitPrice), total: Number(item.lineTotal) });
const mapQuotation = (item: any): Quotation => ({ id: item.id, code: item.code, customerName: item.company?.name || item.companyId, companyId: item.companyId, contactId: item.contactId, dealId: item.dealId, items: (item.items || []).map(mapItem), subtotal: Number(item.subtotal), tax: Number(item.tax), total: Number(item.total), currency: '₹', status: fromQuotationStatus[item.status] || 'draft', validUntil: new Date(item.expiryDate || item.createdAt), createdAt: new Date(item.createdAt), owner: 'Unassigned' });
const mapOrder = (item: any): SalesOrder => ({ id: item.id, code: item.code, customerName: item.company?.name || item.companyId, companyId: item.companyId, dealId: item.dealId, quotationId: item.quotationId, quotationCode: item.quotation?.code, items: (item.items || []).map(mapItem), subtotal: Number(item.subtotal), tax: Number(item.tax), total: Number(item.total), currency: '₹', status: fromOrderStatus[item.status] || 'pending', orderDate: new Date(item.orderDate || item.createdAt), expectedDeliveryDate: item.dueDate ? new Date(item.dueDate) : undefined, owner: 'Unassigned' });
const payloadItems = (items: SalesItem[]) => items.filter((item) => item.productId).map((item) => ({ productId: item.productId, quantity: item.quantity, unitPrice: item.unitPrice, lineTotal: item.total }));

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quotations, setQuotations] = useState<Quotation[]>([]); const [orders, setOrders] = useState<SalesOrder[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null);
  const run = async <T,>(operation: () => Promise<T>) => { try { setError(null); return await operation(); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Sales request failed'); return undefined; } };
  const reload = async () => { setLoading(true); try { const [q, o] = await Promise.all([api.get<any[]>('/quotations'), api.get<any[]>('/orders')]); setQuotations(q.map(mapQuotation)); setOrders(o.map(mapOrder)); setError(null); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Unable to load sales data'); } finally { setLoading(false); } };
  useEffect(() => { void reload(); }, []);
  const addQuotation = async (data: Omit<Quotation, 'id' | 'code' | 'createdAt'>) => { const item = await run(() => api.post<any>('/quotations', { companyId: data.companyId || '', contactId: data.contactId, dealId: data.dealId, status: quotationStatus[data.status], subtotal: data.subtotal, tax: data.tax, total: data.total, expiryDate: data.validUntil })); if (!item) return; for (const line of payloadItems(data.items)) await run(() => api.post(`/quotations/${item.id}/items`, line)); const result = mapQuotation({ ...item, items: data.items }); setQuotations((current) => [result, ...current]); return result; };
  const updateQuotation = async (id: string, data: Partial<Quotation>) => { await run(() => api.patch(`/quotations/${id}`, { companyId: data.companyId, status: data.status && quotationStatus[data.status], subtotal: data.subtotal, tax: data.tax, total: data.total, expiryDate: data.validUntil })); await reload(); };
  const updateQuotationStatus = async (id: string, status: QuotationStatus) => updateQuotation(id, { status });
  const deleteQuotation = async (id: string) => { await run(() => api.delete(`/quotations/${id}`)); setQuotations((current) => current.filter((item) => item.id !== id)); };
  const convertDealToQuotation = async (deal: Deal) => { const item = await run(() => api.post<any>(`/deals/${deal.id}/convert-to-quotation`, { subtotal: deal.value, tax: Math.round(deal.value * .18), total: Math.round(deal.value * 1.18), expiryDate: new Date(Date.now() + 30 * 86400000) })); await reload(); return item ? mapQuotation(item) : undefined; };
  const addOrder = async (data: Omit<SalesOrder, 'id' | 'code' | 'orderDate'>) => { const item = await run(() => api.post<any>('/orders', { companyId: data.companyId || '', contactId: undefined, dealId: data.dealId, quotationId: data.quotationId, status: orderStatus[data.status], subtotal: data.subtotal, tax: data.tax, total: data.total, dueDate: data.expectedDeliveryDate })); if (!item) return; for (const line of payloadItems(data.items)) await run(() => api.post(`/orders/${item.id}/items`, line)); const result = mapOrder({ ...item, items: data.items }); setOrders((current) => [result, ...current]); return result; };
  const updateOrder = async (id: string, data: Partial<SalesOrder>) => { await run(() => api.patch(`/orders/${id}`, { status: data.status && orderStatus[data.status], companyId: data.companyId, dealId: data.dealId, quotationId: data.quotationId, subtotal: data.subtotal, tax: data.tax, total: data.total, dueDate: data.expectedDeliveryDate })); await reload(); };
  const updateOrderStatus = async (id: string, status: OrderStatus) => updateOrder(id, { status });
  const deleteOrder = async (id: string) => { await run(() => api.delete(`/orders/${id}`)); setOrders((current) => current.filter((item) => item.id !== id)); };
  const convertQuotationToOrder = async (quotation: Quotation) => { const item = await run(() => api.post<any>(`/quotations/${quotation.id}/convert-to-order`, {})); await reload(); return item ? mapOrder(item) : undefined; };
  return <SalesContext.Provider value={{ quotations, orders, loading, error, reload, addQuotation, updateQuotation, updateQuotationStatus, deleteQuotation, convertDealToQuotation, addOrder, updateOrder, updateOrderStatus, deleteOrder, convertQuotationToOrder }}>{children}</SalesContext.Provider>;
};

export const useSales = () => { const context = useContext(SalesContext); if (!context) throw new Error('useSales must be used within a SalesProvider'); return context; };
