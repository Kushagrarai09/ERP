import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { LoginPage } from './auth/LoginPage';
import { SignupPage } from './auth/SignupPage';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { CRMProvider } from './modules/crm/crmContext';
import { FinanceProvider } from './modules/finance/financeContext';
import { InventoryProvider } from './modules/inventory/inventoryContext';
import { ProcurementProvider } from './modules/procurement/procurementContext';
import { SalesProvider } from './modules/sales/salesContext';
import Dashboard from './modules/app/Dashboard';
import CRMModule from './modules/crm/CRMModule';
import FinanceModule from './modules/finance/FinanceModule';
import InventoryModule from './modules/inventory/InventoryModule';
import ProcurementModule from './modules/procurement/ProcurementModule';
import SalesModule from './modules/sales/SalesModule';

function Providers() { return <CRMProvider><InventoryProvider><SalesProvider><ProcurementProvider><FinanceProvider><Outlet /></FinanceProvider></ProcurementProvider></SalesProvider></InventoryProvider></CRMProvider>; }

export default function App() {
  return <Routes><Route path="/login" element={<LoginPage />} /><Route path="/signup" element={<SignupPage />} /><Route element={<ProtectedRoute />}><Route element={<Providers />}><Route path="/dashboard" element={<Dashboard />} /><Route path="/crm/*" element={<CRMModule />} /><Route path="/inventory/*" element={<InventoryModule />} /><Route path="/sales/*" element={<SalesModule />} /><Route path="/procurement/*" element={<ProcurementModule />} /><Route path="/finance/*" element={<FinanceModule />} /><Route path="*" element={<Navigate to="/dashboard" replace />} /></Route></Route><Route path="*" element={<Navigate to="/dashboard" replace />} /></Routes>;
}