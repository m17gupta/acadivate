import type { LucideIcon } from 'lucide-react';
import { BadgeCheck, CalendarRange, Globe2, Medal, MessageSquareText } from 'lucide-react';

export type DashboardModuleId = 'events' | 'awards' | 'nominations' | 'rankings' | 'leads';

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

const countByValue = (rows: DashboardModuleRow[], key: string, value: string) =>
  rows.filter((row) => row.values[key] === value).length;

export const eventsModule: DashboardModuleConfig = {
  id: 'events',
  title: 'Events',
  subtitle: 'Create, edit, publish, and archive conferences, workshops, and featured events.',
  intro:
    'Keep the public event feed, featured cards, and admin records synchronized from one page.',
  route: '/dashboard/events',
  actionLabel: 'Add Event',
  searchPlaceholder: 'Search events, dates, and venues...',
  accent: 'primary',
  icon: CalendarRange,
  fields: [
    {
      key: 'title',
      label: 'Event title',
      type: 'text',
      placeholder: 'ICASD 2026 - International Research Conference',
      required: true,
      span: 2,
    },
    {
      key: 'slug',
      label: 'Slug',
      type: 'text',
      placeholder: 'icasd-2026',
      required: true,
    },
    {
      key: 'type',
      label: 'Type',
      type: 'select',
      options: ['Conference', 'Workshop', 'Forum', 'Summit'],
      placeholder: 'Select event type',
      required: true,
    },
    {
      key: 'eventDate',
      label: 'Event date',
      type: 'date',
      placeholder: 'Select event date',
      required: true,
    },
    {
      key: 'startTime',
      label: 'Start time',
      type: 'text',
      placeholder: '09:00 AM',
      required: true,
    },
    {
      key: 'location',
      label: 'Location',
      type: 'text',
      placeholder: 'Kuala Lumpur, Malaysia',
      required: true,
      span: 2,
    },
    {
      key: 'featured',
      label: 'Featured',
      type: 'select',
      options: ['Yes', 'No'],
      placeholder: 'Is this featured?',
      required: true,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: ['Draft', 'Scheduled', 'Published', 'Archived'],
      placeholder: 'Select publication status',
      required: true,
    },
    {
      key: 'imageUrl',
      label: 'Event images',
      type: 'file',
      placeholder: 'Import one or more event images for the gallery',
      accept: 'image/*',
      multiple: true,
      span: 2,
    },
  ],
  columns: [
    { key: 'title', label: 'Title' },
    { key: 'eventDate', label: 'Date' },
    { key: 'location', label: 'Location' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
  ],
  tableTemplateColumns:
    'minmax(0, 1.45fr) minmax(0, 0.9fr) minmax(0, 1.15fr) minmax(0, 0.8fr) minmax(0, 0.85fr)',
  initialRows: [
    {
      id: 'event-1',
      values: {
        title: 'ICASD 2026 - International Research Conference',
        slug: 'icasd-2026',
        type: 'Conference',
        eventDate: '2026-05-21',
        startTime: '09:00 AM',
        location: 'Kuala Lumpur, Malaysia',
        featured: 'Yes',
        status: 'Published',
        imageUrl: ['/assets/Image/event1.jpeg', '/assets/Image/event2.jpg'],
      },
    },
    {
      id: 'event-2',
      values: {
        title: 'ICGSD 2025 - Global Academic Conference',
        slug: 'icgsd-2025',
        type: 'Conference',
        eventDate: '2025-07-22',
        startTime: '10:00 AM',
        location: 'Dubai, UAE',
        featured: 'Yes',
        status: 'Scheduled',
        imageUrl: ['/assets/Image/event3.png', '/assets/Image/event4.jpg'],
      },
    },
    {
      id: 'event-3',
      values: {
        title: 'Research Methodology Workshop',
        slug: 'research-methodology-workshop',
        type: 'Workshop',
        eventDate: '2026-08-10',
        startTime: '09:00 AM',
        location: 'Online / India',
        featured: 'No',
        status: 'Draft',
        imageUrl: ['/assets/Image/research.jpeg'],
      },
    },
  ],
  statusToneMap: {
    Draft: 'warning',
    Scheduled: 'neutral',
    Published: 'success',
    Archived: 'danger',
  },
  buildSummary: (rows) => [
    { label: 'Total events', value: String(rows.length), tone: 'neutral' },
    { label: 'Published', value: String(countByValue(rows, 'status', 'Published')), tone: 'success' },
    { label: 'Scheduled', value: String(countByValue(rows, 'status', 'Scheduled')), tone: 'warning' },
    { label: 'Featured', value: String(countByValue(rows, 'featured', 'Yes')), tone: 'neutral' },
  ],
};

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
      label: 'Banner image',
      type: 'text',
      placeholder: '/images/awards/hero.jpg',
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
      id: 'award-1',
      values: {
        title: 'Academic Excellence Awards 2025',
        cycle: '2025',
        category: 'Institutional',
        nominationDeadline: '2025-11-20',
        status: 'Review',
        imageUrl: '/images/awards/excellence.jpg',
      },
    },
    {
      id: 'award-2',
      values: {
        title: 'Lifetime Achievement Awards',
        cycle: '2026',
        category: 'Recognition',
        nominationDeadline: '2026-03-15',
        status: 'Published',
        imageUrl: '/images/awards/lifetime.jpg',
      },
    },
    {
      id: 'award-3',
      values: {
        title: 'Young Researcher Awards',
        cycle: '2026',
        category: 'Innovation',
        nominationDeadline: '2026-06-10',
        status: 'Open',
        imageUrl: '/images/awards/young-researcher.jpg',
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

export const nominationsModule: DashboardModuleConfig = {
  id: 'nominations',
  title: 'Nominations',
  subtitle: 'Review award nominations, submissions, and approval status.',
  intro:
    'Track incoming nominations and keep the review pipeline organized from one page.',
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
  tableTemplateColumns:
    'minmax(0, 1.35fr) minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 0.85fr)',
  initialRows: [
    {
      id: 'nomination-1',
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
      id: 'nomination-2',
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
      id: 'nomination-3',
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
      label: 'Logo image',
      type: 'text',
      placeholder: '/images/rankings/iit-delhi.png',
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
      id: 'ranking-1',
      values: {
        institution: 'IIT Delhi',
        country: 'India',
        rank: '#1',
        score: '94.8',
        status: 'Published',
        logoUrl: '/images/rankings/iit-delhi.png',
      },
    },
    {
      id: 'ranking-2',
      values: {
        institution: 'IISc Bengaluru',
        country: 'India',
        rank: '#2',
        score: '93.2',
        status: 'Published',
        logoUrl: '/images/rankings/iisc.png',
      },
    },
    {
      id: 'ranking-3',
      values: {
        institution: 'Manipal University Malaysia',
        country: 'Malaysia',
        rank: '#4',
        score: '89.7',
        status: 'Review',
        logoUrl: '/images/rankings/manipal.png',
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

export const leadsModule: DashboardModuleConfig = {
  id: 'leads',
  title: 'Leads',
  subtitle: 'Review contact enquiries, newsletter signups, and partnership leads.',
  intro:
    'Track inbound enquiries and respond to them without leaving the dashboard workspace.',
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
  tableTemplateColumns:
    'minmax(0, 1.15fr) minmax(0, 1.2fr) minmax(0, 0.95fr) minmax(0, 0.85fr)',
  initialRows: [
    {
      id: 'lead-1',
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
      id: 'lead-2',
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
      id: 'lead-3',
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

export const dashboardModuleList = [
  eventsModule,
  awardsModule,
  nominationsModule,
  rankingsModule,
  leadsModule,
];

export const dashboardNavItems = dashboardModuleList.map((module) => ({
  label: module.title,
  href: module.route,
  icon: module.icon,
  badge: 'CRUD',
}));

export const dashboardRouteSearchPlaceholders: Record<string, string> = {
  '/dashboard': 'Search modules, records, and workflows...',
  '/dashboard/events': eventsModule.searchPlaceholder,
  '/dashboard/awards': awardsModule.searchPlaceholder,
  '/dashboard/nominations': nominationsModule.searchPlaceholder,
  '/dashboard/rankings': rankingsModule.searchPlaceholder,
  '/dashboard/leads': leadsModule.searchPlaceholder,
};

export function resolveDashboardSearchPlaceholder(pathname?: string | null) {
  if (!pathname) {
    return dashboardRouteSearchPlaceholders['/dashboard'];
  }

  if (pathname.startsWith('/dashboard/events')) {
    return eventsModule.searchPlaceholder;
  }

  if (pathname.startsWith('/dashboard/awards')) {
    return awardsModule.searchPlaceholder;
  }

  if (pathname.startsWith('/dashboard/nominations')) {
    return nominationsModule.searchPlaceholder;
  }

  if (pathname.startsWith('/dashboard/rankings')) {
    return rankingsModule.searchPlaceholder;
  }

  if (pathname.startsWith('/dashboard/leads')) {
    return leadsModule.searchPlaceholder;
  }

  return dashboardRouteSearchPlaceholders['/dashboard'];
}
