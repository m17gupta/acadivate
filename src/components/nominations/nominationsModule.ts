import { BadgeCheck } from 'lucide-react';
import type { DashboardModuleConfig } from '../dashboard/dashboardTypes';
import { countByValue } from '../dashboard/dashboardTypes';

export const nominationsModule: DashboardModuleConfig = {
  id: 'nominations',
  title: 'Nominations',
  subtitle: 'Review award nominations, submissions, and approval status.',
  intro: 'Track incoming nominations and keep the review pipeline organized from one page.',
  route: '/dashboard/nominations',
  actionLabel: 'Add Nomination',
  searchPlaceholder: 'Search nominations, nominees, and awards...',
  accent: 'sage',
  icon: BadgeCheck,
  fields: [
    {
      key: 'nomineeName',
      label: 'Nominee name',
      type: 'text',
      placeholder: 'Dr. Ananya Sharma',
      required: true,
      span: 2,
    },
    {
      key: 'award',
      label: 'Award',
      type: 'text',
      placeholder: 'Academic Excellence Awards 2025',
      required: true,
    },
    {
      key: 'category',
      label: 'Category',
      type: 'text',
      placeholder: 'Research',
      required: true,
    },
    {
      key: 'submittedOn',
      label: 'Submitted on',
      type: 'date',
      placeholder: 'Select submission date',
      required: true,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: ['New', 'Under Review', 'Shortlisted', 'Approved', 'Rejected'],
      placeholder: 'Select status',
      required: true,
    },
    {
      key: 'note',
      label: 'Internal note',
      type: 'textarea',
      placeholder: 'Add review notes for the committee.',
      span: 2,
    },
  ],
  columns: [
    { key: 'nomineeName', label: 'Nominee' },
    { key: 'award', label: 'Award' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status' },
  ],
  tableTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 0.85fr)',
  initialRows: [
    {
      id: '660000000000000000000011',
      values: {
        nomineeName: 'Dr. Ananya Sharma',
        award: 'Academic Excellence Awards 2025',
        category: 'Research',
        submittedOn: '2025-10-12',
        status: 'Under Review',
        note: 'Requested supporting documents from the department.',
      },
    },
    {
      id: '660000000000000000000012',
      values: {
        nomineeName: 'Prof. Omar Al Hadi',
        award: 'Lifetime Achievement Awards',
        category: 'Leadership',
        submittedOn: '2025-11-04',
        status: 'Shortlisted',
        note: 'Approved by the first review panel.',
      },
    },
    {
      id: '660000000000000000000013',
      values: {
        nomineeName: 'Dr. Mei Lin',
        award: 'Young Researcher Awards',
        category: 'Innovation',
        submittedOn: '2025-12-01',
        status: 'New',
        note: 'Awaiting committee review.',
      },
    },
  ],
  statusToneMap: {
    New: 'neutral',
    'Under Review': 'warning',
    Shortlisted: 'success',
    Approved: 'success',
    Rejected: 'danger',
  },
  buildSummary: (rows) => [
    { label: 'Total nominations', value: String(rows.length), tone: 'neutral' },
    { label: 'New', value: String(countByValue(rows, 'status', 'New')), tone: 'neutral' },
    {
      label: 'Under review',
      value: String(countByValue(rows, 'status', 'Under Review')),
      tone: 'warning',
    },
    {
      label: 'Approved',
      value: String(countByValue(rows, 'status', 'Approved')),
      tone: 'success',
    },
  ],
};
