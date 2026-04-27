import { Trophy } from 'lucide-react';
import type { DashboardModuleConfig } from '../dashboard/dashboardTypes';
import { countByValue } from '../dashboard/dashboardTypes';

export const awardsListModule: DashboardModuleConfig = {
  id: 'awards-list',
  title: 'Awards List',
  subtitle: 'Manage specific award instances and their nomination deadlines.',
  intro:
    'Combine categories and items into specific awards with their own timelines and status.',
  route: '/dashboard/awards-list',
  actionLabel: 'Add Award',
  searchPlaceholder: 'Search awards...',
  accent: 'gold',
  icon: Trophy,
  fields: [
    {
      key: 'selectedAwards',
      label: 'Academic Award Categories & Items',
      type: 'capsule-select',
      placeholder: 'Click categories to add and select items',
      sourceModule: 'awards',
      span: 2,
      required: true,
    },
    {
      key: 'deadline',
      label: 'Nomination Deadline',
      type: 'date',
      placeholder: 'Select deadline',
      required: true,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: ['Draft', 'Open', 'Review', 'Published', 'Archived'],
      placeholder: 'Select status',
      required: true,
    },
    {
      key: 'active',
      label: 'Is Active',
      type: 'checkbox',
      placeholder: 'Mark this award as active',
    },
  ],
  columns: [
    { key: 'selectedAwards', label: 'Selected Awards' },
    { key: 'deadline', label: 'Deadline' },
    { key: 'status', label: 'Status' },
  ],
  tableTemplateColumns:
    'minmax(0, 2.5fr) minmax(0, 1fr) minmax(0, 0.8fr)',
  initialRows: [],
  statusToneMap: {
    Draft: 'neutral',
    Open: 'warning',
    Review: 'warning',
    Published: 'success',
    Archived: 'danger',
  },
  buildSummary: (rows) => [
    { label: 'Total awards', value: String(rows.length), tone: 'neutral' },
    { label: 'Open', value: String(countByValue(rows, 'status', 'Open')), tone: 'warning' },
  ],
};
