import { MessageSquareText } from 'lucide-react';
import type { DashboardModuleConfig } from '../dashboard/dashboardTypes';
import { countByValue } from '../dashboard/dashboardTypes';

export const leadsModule: DashboardModuleConfig = {
  id: 'leads',
  title: 'Leads',
  subtitle: 'Review contact enquiries, newsletter signups, and partnership leads.',
  intro: 'Track inbound enquiries and respond to them without leaving the dashboard workspace.',
  route: '/dashboard/leads',
  actionLabel: 'Add Lead',
  searchPlaceholder: 'Search leads, names, and emails...',
  accent: 'crimson',
  icon: MessageSquareText,
  fields: [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      placeholder: 'Priya Nair',
      required: true,
      span: 2,
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      placeholder: 'priya@university.edu',
      required: true,
    },
    {
      key: 'source',
      label: 'Source',
      type: 'text',
      placeholder: 'Contact form',
      required: true,
    },
    {
      key: 'subject',
      label: 'Subject',
      type: 'text',
      placeholder: 'Conference partnership inquiry',
      required: true,
      span: 2,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: ['New', 'Open', 'Replied', 'Closed'],
      placeholder: 'Select status',
      required: true,
    },
    {
      key: 'note',
      label: 'Internal note',
      type: 'textarea',
      placeholder: 'Add any follow-up details for the team here.',
      span: 2,
    },
  ],
  columns: [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'source', label: 'Source' },
    { key: 'status', label: 'Status' },
  ],
  tableTemplateColumns: 'minmax(0, 1.15fr) minmax(0, 1.2fr) minmax(0, 0.95fr) minmax(0, 0.85fr)',
  initialRows: [
    {
      id: '660000000000000000000041',
      values: {
        name: 'Priya Nair',
        email: 'priya@university.edu',
        source: 'Contact form',
        subject: 'Conference partnership inquiry',
        status: 'Open',
        note: 'Requested a call next week.',
      },
    },
    {
      id: '660000000000000000000042',
      values: {
        name: 'Rahul Desai',
        email: 'rahul@research.org',
        source: 'Newsletter',
        subject: 'Workshop reminder',
        status: 'New',
        note: 'Interested in workshop sponsorship.',
      },
    },
    {
      id: '660000000000000000000043',
      values: {
        name: 'Dr. Fatima',
        email: 'fatima@institute.ae',
        source: 'Conference inquiry',
        subject: 'Speaker panel availability',
        status: 'Replied',
        note: 'Awaiting final confirmation.',
      },
    },
  ],
  statusToneMap: {
    New: 'neutral',
    Open: 'warning',
    Replied: 'success',
    Closed: 'danger',
  },
  buildSummary: (rows) => [
    { label: 'Total leads', value: String(rows.length), tone: 'neutral' },
    { label: 'Open', value: String(countByValue(rows, 'status', 'Open')), tone: 'warning' },
    { label: 'New', value: String(countByValue(rows, 'status', 'New')), tone: 'neutral' },
    { label: 'Replied', value: String(countByValue(rows, 'status', 'Replied')), tone: 'success' },
  ],
};
