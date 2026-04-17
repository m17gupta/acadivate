import { ClipboardList } from 'lucide-react';
import type { DashboardModuleConfig } from '../dashboard/dashboardTypes';

export const formsModule: DashboardModuleConfig = {
  id: 'forms',
  title: 'Forms',
  subtitle: 'Manage dashboard forms for nominations, registrations, and future workflows.',
  intro:
    'Keep form-driven admin workflows in one place so the dashboard can grow without becoming cluttered.',
  route: '/dashboard/forms',
  actionLabel: 'Add Form',
  searchPlaceholder: 'Search forms, templates, and submissions...',
  accent: 'primary',
  icon: ClipboardList,
  fields: [
    {
      key: 'name',
      label: 'Form name',
      type: 'text',
      placeholder: 'Nomination form',
      required: true,
      span: 2,
    },
    {
      key: 'slug',
      label: 'Slug',
      type: 'text',
      placeholder: 'nomination-form',
      required: true,
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Describe what this form is used for...',
      required: false,
      span: 2,
    },
  ],
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'status', label: 'Status' },
  ],
  tableTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 0.85fr)',
  initialRows: [],
  statusToneMap: {
    Draft: 'neutral',
    Active: 'success',
    Archived: 'danger',
  },
  buildSummary: (rows) => [
    { label: 'Total forms', value: String(rows.length), tone: 'neutral' },
    { label: 'Active', value: '0', tone: 'success' },
    { label: 'Draft', value: '0', tone: 'warning' },
    { label: 'Archived', value: '0', tone: 'danger' },
  ],
};
