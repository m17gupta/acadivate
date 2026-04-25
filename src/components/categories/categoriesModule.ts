import { Medal } from 'lucide-react';
import type { DashboardModuleConfig } from '../dashboard/dashboardTypes';

export const categoriesModule: DashboardModuleConfig = {
  id: 'categories',
  title: 'Categories',
  subtitle: 'Manage award categories, descriptions, and tag associations.',
  intro:
    'Maintain the list of award categories, their descriptions, and associated metadata for the public Awards page.',
  route: '/dashboard/categories',
  actionLabel: 'Add Category',
  searchPlaceholder: 'Search categories, tags, and descriptions...',
  accent: 'gold',
  icon: Medal,
  fields: [
    {
      key: 'title',
      label: 'Category title',
      type: 'text',
      placeholder: 'Excellence in Research',
      required: true,
      span: 2,
    },
    {
      key: 'desc',
      label: 'Description',
      type: 'textarea',
      placeholder: 'Original, high-impact research...',
      required: true,
      span: 2,
    },
    {
      key: 'count',
      label: 'Count info',
      type: 'text',
      placeholder: '12 sub-categories',
      required: true,
    },
    {
      key: 'color',
      label: 'Color theme',
      type: 'text',
      placeholder: 'gold',
      required: true,
    },
    {
      key: 'tags',
      label: 'Tags',
      type: 'text',
      placeholder: 'Sciences, Humanities, Technology',
      required: true,
      span: 2,
    },
  ],
  columns: [
    { key: 'title', label: 'Title' },
    { key: 'count', label: 'Count' },
    { key: 'color', label: 'Color' },
    { key: 'tags', label: 'Tags' },
  ],
  tableTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 0.8fr) minmax(0, 1.2fr)',
  initialRows: [
    // {
    //   id: '660000000000000000000051',
    //   values: {
    //     title: 'Excellence in Research',
    //     desc: 'Original, high-impact research that advances human knowledge and addresses pressing global challenges through rigorous, evidence-based inquiry.',
    //     tags: ['Sciences', 'Humanities', 'Technology', 'Social Sciences'],
    //     count: '12 sub-categories',
    //     color: 'gold',
    //   },
    // },
  ],
  statusToneMap: {},
  buildSummary: (rows) => [
    { label: 'Total categories', value: String(rows.length), tone: 'neutral' },
  ],
};
