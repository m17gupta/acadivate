import { CreditCard } from 'lucide-react';
import type { DashboardModuleConfig } from '../dashboard/dashboardTypes';
import { countByValue } from '../dashboard/dashboardTypes';

export const paymentsModule: DashboardModuleConfig = {
  id: 'payments',
  title: 'Payments',
  subtitle: 'Manage and track all award nomination payments.',
  intro: 'Monitor payment transactions, verify status, and handle billing inquiries.',
  route: '/dashboard/payments',
  actionLabel: '',
  searchPlaceholder: 'Search payments by ID, order, or status...',
  accent: 'primary',
  icon: CreditCard,
  fields: [],
  columns: [
    { key: 'paymentId', label: 'Payment ID' },
    { key: 'orderId', label: 'Order ID' },
    { key: 'amount', label: 'Amount' },
    { key: 'status', label: 'Status' },
  ],
  tableTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1.5fr) minmax(0, 0.8fr) minmax(0, 0.7fr)',
  initialRows: [],
  statusToneMap: {
    success: 'success',
    failed: 'danger',
    pending: 'warning',
  },
  buildSummary: (rows) => [
    { label: 'Total Payments', value: String(rows.length), tone: 'neutral' },
    { label: 'Success', value: String(countByValue(rows, 'status', 'success')), tone: 'success' },
    { label: 'Pending', value: String(countByValue(rows, 'status', 'pending')), tone: 'warning' },
    { label: 'Failed', value: String(countByValue(rows, 'status', 'failed')), tone: 'danger' },
  ],
};
