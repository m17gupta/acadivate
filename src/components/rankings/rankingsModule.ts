import { Globe2 } from 'lucide-react';
import type { DashboardModuleConfig } from '../dashboard/dashboardTypes';
import { countByValue } from '../dashboard/dashboardTypes';

export const rankingsModule: DashboardModuleConfig = {
  id: 'rankings',
  title: 'Rankings',
  subtitle: 'Update institutional rankings, scores, and published ranking order.',
  intro:
    'Maintain the public ranking list, score changes, and publication status from one workspace.',
  route: '/dashboard/rankings',
  actionLabel: 'Add Ranking',
  searchPlaceholder: 'Search rankings, institutions, and scores...',
  accent: 'sage',
  icon: Globe2,
  fields: [
    {
      key: 'institution',
      label: 'Institution',
      type: 'text',
      placeholder: 'IIT Delhi',
      required: true,
      span: 2,
    },
    {
      key: 'country',
      label: 'Country',
      type: 'text',
      placeholder: 'India',
      required: true,
    },
    {
      key: 'rank',
      label: 'Rank',
      type: 'text',
      placeholder: '#1',
      required: true,
    },
    {
      key: 'score',
      label: 'Score',
      type: 'number',
      placeholder: '94.8',
      required: true,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: ['Draft', 'Review', 'Published', 'Archived'],
      placeholder: 'Select status',
      required: true,
    },
    {
      key: 'logoUrl',
      label: 'Logo images',
      type: 'file',
      placeholder: 'Import one or more logo images for the gallery',
      accept: 'image/*',
      multiple: true,
      span: 2,
    },
  ],
  columns: [
    { key: 'institution', label: 'Institution' },
    { key: 'country', label: 'Country' },
    { key: 'rank', label: 'Rank' },
    { key: 'score', label: 'Score' },
    { key: 'status', label: 'Status' },
  ],
  tableTemplateColumns:
    'minmax(0, 1.55fr) minmax(0, 0.95fr) minmax(0, 0.6fr) minmax(0, 0.7fr) minmax(0, 0.85fr)',
  initialRows: [
    {
      id: '660000000000000000000031',
      values: {
        institution: 'IIT Delhi',
        country: 'India',
        rank: '#1',
        score: '94.8',
        status: 'Published',
        logoUrl: ['/images/rankings/iit-delhi.png'],
      },
    },
    {
      id: '660000000000000000000032',
      values: {
        institution: 'IISc Bengaluru',
        country: 'India',
        rank: '#2',
        score: '93.2',
        status: 'Published',
        logoUrl: ['/images/rankings/iisc.png'],
      },
    },
    {
      id: '660000000000000000000033',
      values: {
        institution: 'Manipal University Malaysia',
        country: 'Malaysia',
        rank: '#4',
        score: '89.7',
        status: 'Review',
        logoUrl: ['/images/rankings/manipal.png'],
      },
    },
  ],
  statusToneMap: {
    Draft: 'warning',
    Review: 'neutral',
    Published: 'success',
    Archived: 'danger',
  },
  buildSummary: (rows) => [
    { label: 'Institutions', value: String(rows.length), tone: 'neutral' },
    { label: 'Published', value: String(countByValue(rows, 'status', 'Published')), tone: 'success' },
    { label: 'In review', value: String(countByValue(rows, 'status', 'Review')), tone: 'warning' },
    { label: 'Drafts', value: String(countByValue(rows, 'status', 'Draft')), tone: 'warning' },
  ],
};
