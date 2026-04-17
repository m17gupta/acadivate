import type { LucideIcon } from 'lucide-react';

export type DashboardModuleId = 'events' | 'awards' | 'nominations' | 'rankings' | 'leads' | 'categories' | 'registrations' | 'sliders' | 'forms';

export type DashboardStatusTone = 'neutral' | 'success' | 'warning' | 'danger';

export type DashboardAccent = 'primary' | 'gold' | 'sage' | 'crimson';

export type DashboardModuleFieldType = 'text' | 'email' | 'date' | 'number' | 'select' | 'textarea' | 'file';

export type DashboardModuleField = {
  key: string;
  label: string;
  type: DashboardModuleFieldType;
  placeholder: string;
  required?: boolean;
  options?: string[];
  span?: 1 | 2;
  accept?: string;
  multiple?: boolean;
};

export type DashboardModuleRow = {
  id: string;
  values: Record<string, string | string[]>;
};

export type DashboardSummaryCard = {
  label: string;
  value: string;
  tone: DashboardStatusTone;
};

export type DashboardModuleConfig = {
  id: DashboardModuleId;
  title: string;
  subtitle: string;
  intro: string;
  route: `/dashboard/${DashboardModuleId}`;
  actionLabel: string;
  searchPlaceholder: string;
  accent: DashboardAccent;
  icon: LucideIcon;
  fields: DashboardModuleField[];
  columns: Array<{ key: string; label: string }>;
  tableTemplateColumns: string;
  initialRows: DashboardModuleRow[];
  statusToneMap: Record<string, DashboardStatusTone>;
  buildSummary: (rows: DashboardModuleRow[]) => DashboardSummaryCard[];
};

export const countByValue = (rows: DashboardModuleRow[], key: string, value: string) =>
  rows.filter((row) => row.values[key] === value).length;
