import { Medal } from 'lucide-react';
import type { DashboardModuleConfig } from '../dashboard/dashboardTypes';
import { countByValue } from '../dashboard/dashboardTypes';

export const awardsModule: DashboardModuleConfig = {
  id: 'awards',
  title: 'Awards',
  subtitle: 'Manage award campaigns, nomination windows, categories, and winners.',
  intro:
    'Keep nomination launches, review cycles, and winner announcements in one dedicated page.',
  route: '/dashboard/awards',
  actionLabel: 'Add Award',
  searchPlaceholder: 'Search awards, categories, and cycles...',
  accent: 'gold',
  icon: Medal,
  fields: [
    {
      key: 'title',
      label: 'Award title',
      type: 'text',
      placeholder: 'Academic Excellence Awards 2025',
      required: true,
      span: 2,
    },
    {
      key: 'cycle',
      label: 'Cycle',
      type: 'text',
      placeholder: '2025',
      required: true,
    },
    {
      key: 'category',
      label: 'Category',
      type: 'text',
      placeholder: 'Institutional',
      required: true,
    },
    {
      key: 'nominationDeadline',
      label: 'Nomination deadline',
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
      key: 'imageUrl',
      label: 'Award images',
      type: 'file',
      placeholder: 'Import one or more award images for the gallery',
      accept: 'image/*',
      multiple: true,
      span: 2,
    },
  ],
  columns: [
    { key: 'title', label: 'Title' },
    { key: 'cycle', label: 'Cycle' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status' },
  ],
  tableTemplateColumns:
    'minmax(0, 1.6fr) minmax(0, 0.8fr) minmax(0, 1fr) minmax(0, 0.85fr)',
  initialRows: [
    {
      id: '660000000000000000000021',
      values: {
        title: 'Academic Excellence Awards 2025',
        cycle: '2025',
        category: 'Institutional',
        nominationDeadline: '2025-11-20',
        status: 'Review',
        imageUrl: ['/images/awards/excellence.jpg'],
      },
    },
    {
      id: '660000000000000000000022',
      values: {
        title: 'Lifetime Achievement Awards',
        cycle: '2026',
        category: 'Recognition',
        nominationDeadline: '2026-03-15',
        status: 'Published',
        imageUrl: ['/images/awards/lifetime.jpg'],
      },
    },
    {
      id: '660000000000000000000023',
      values: {
        title: 'Young Researcher Awards',
        cycle: '2026',
        category: 'Innovation',
        nominationDeadline: '2026-06-10',
        status: 'Open',
        imageUrl: ['/images/awards/young-researcher.jpg'],
      },
    },
  ],
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
    { label: 'In review', value: String(countByValue(rows, 'status', 'Review')), tone: 'warning' },
    { label: 'Published', value: String(countByValue(rows, 'status', 'Published')), tone: 'success' },
  ],
};
