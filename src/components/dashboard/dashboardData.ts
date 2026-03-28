import type { LucideIcon } from 'lucide-react';
import {
  BadgeCheck,
  CalendarRange,
  Globe2,
  Medal,
  MessageSquareText,
  MousePointerClick,
  Sparkles,
  Users,
} from 'lucide-react';

export type SidebarLink = {
  label: string;
  icon: LucideIcon;
  targetId: string;
  badge?: string;
  active?: boolean;
};

export const sidebarGroups: { title: string; links: SidebarLink[] }[] = [
  {
    title: 'Content Management',
    links: [
      { label: 'Events', icon: CalendarRange, targetId: 'events', badge: 'CRUD', active: true },
      { label: 'Awards', icon: Medal, targetId: 'awards', badge: 'CRUD' },
      { label: 'Nominations', icon: BadgeCheck, targetId: 'nominations', badge: 'CRUD' },
      { label: 'Rankings', icon: Globe2, targetId: 'rankings', badge: 'CRUD' },
      { label: 'Leads', icon: MessageSquareText, targetId: 'leads', badge: 'CRUD' },
    ],
  },
];

export const visitBars = [
  { month: 'Jan', primary: 36, secondary: 28 },
  { month: 'Feb', primary: 48, secondary: 34 },
  { month: 'Mar', primary: 31, secondary: 20 },
  { month: 'Apr', primary: 44, secondary: 30 },
  { month: 'May', primary: 32, secondary: 18 },
  { month: 'Jun', primary: 22, secondary: 14 },
  { month: 'Jul', primary: 38, secondary: 26 },
  { month: 'Aug', primary: 46, secondary: 31 },
  { month: 'Sep', primary: 50, secondary: 33 },
  { month: 'Oct', primary: 35, secondary: 24 },
  { month: 'Nov', primary: 41, secondary: 29 },
  { month: 'Dec', primary: 30, secondary: 19 },
];

export const donutStats = [
  { label: 'India', value: 44, color: '#0f5f78', delta: '+8.4%' },
  { label: 'UAE', value: 28, color: '#f15a24', delta: '+3.1%' },
  { label: 'Malaysia', value: 18, color: '#d9ae5e', delta: '+1.7%' },
  { label: 'Other', value: 10, color: '#243672', delta: '-0.6%' },
];

export const kpis = [
  {
    title: 'Active researchers',
    value: '126,426',
    delta: '+12.4%',
    tone: 'positive',
    icon: Users,
  },
  {
    title: 'Conference conversion',
    value: '5.3%',
    delta: '-1.5%',
    tone: 'negative',
    icon: Sparkles,
  },
  {
    title: 'Nomination clicks',
    value: '11,510',
    delta: '+9.1%',
    tone: 'positive',
    icon: MousePointerClick,
  },
];

export const campaigns = [
  { platform: 'ICASD 2026', subtitle: 'International conference campaign', users: '8.49k reach', status: 'Running' },
  { platform: 'Acadivate Awards', subtitle: 'Institutional nomination funnel', users: '9.12k reach', status: 'Review' },
  { platform: 'Research Rankings', subtitle: 'Ranking submission program', users: '6.98k reach', status: 'Paused' },
];

export const trafficRows = [
  { source: 'Direct', visits: '1,300', bounce: '30%', goal: 80, color: 'bg-gold' },
  { source: 'Organic', visits: '3,000', bounce: '10%', goal: 55, color: 'bg-primary-dark' },
  { source: 'Referral', visits: '2,000', bounce: '80%', goal: 20, color: 'bg-rose-500' },
  { source: 'Scholar Partnerships', visits: '1,120', bounce: '24%', goal: 72, color: 'bg-navy-4' },
];

export const insights = [
  { label: 'All-time revenue', value: '$395.7k', delta: '+2.7%' },
  { label: 'Institution score uplift', value: '84.2%', delta: '+6.1%' },
];

export const miniCards = [
  { label: 'Events', value: '24', icon: CalendarRange },
  { label: 'Awards', value: '12', icon: Medal },
  { label: 'Rankings', value: '06', icon: Globe2 },
  { label: 'Leads', value: '128', icon: MessageSquareText },
];

export type CrudStatusTone = 'neutral' | 'success' | 'warning' | 'danger';

export type CrudRow = {
  cells: string[];
  status: string;
  tone: CrudStatusTone;
};

export type ManagementSection = {
  id: 'events' | 'awards' | 'nominations' | 'rankings' | 'leads';
  title: string;
  subtitle: string;
  accent: 'primary' | 'gold' | 'sage' | 'crimson';
  actionLabel: string;
  columns: string[];
  rows: CrudRow[];
  helper: string;
};

export const managementSections: ManagementSection[] = [
  {
    id: 'events',
    title: 'Events',
    subtitle: 'Create, edit, publish, and archive conferences, workshops, and featured events.',
    accent: 'primary',
    actionLabel: 'Create Event',
    columns: ['Title', 'Date', 'Type', 'Status'],
    helper: 'Use this section to keep the public event listings and detail pages in sync.',
    rows: [
      { cells: ['ICASD 2026', '21 May 2026', 'Conference'], status: 'Published', tone: 'success' },
      { cells: ['ICGSD 2025', '22 Jul 2025', 'Conference'], status: 'Draft', tone: 'warning' },
      { cells: ['Research Methodology Workshop', '10 Aug 2026', 'Workshop'], status: 'Scheduled', tone: 'neutral' },
    ],
  },
  {
    id: 'awards',
    title: 'Awards',
    subtitle: 'Manage award campaigns, nomination windows, categories, and winners.',
    accent: 'gold',
    actionLabel: 'Create Award',
    columns: ['Title', 'Cycle', 'Category', 'Status'],
    helper: 'Keep nominations, categories, and winner listings aligned with the public awards pages.',
    rows: [
      { cells: ['Academic Excellence Awards 2025', '2025', 'Institutional'], status: 'Review', tone: 'warning' },
      { cells: ['Lifetime Achievement Awards', '2026', 'Recognition'], status: 'Published', tone: 'success' },
      { cells: ['Young Researcher Awards', '2026', 'Innovation'], status: 'Draft', tone: 'neutral' },
    ],
  },
  {
    id: 'nominations',
    title: 'Nominations',
    subtitle: 'Review award nominations, supporting notes, and approval decisions.',
    accent: 'sage',
    actionLabel: 'Create Nomination',
    columns: ['Nominee', 'Award', 'Category', 'Status'],
    helper: 'Keep every nomination in one place while the review team works through approvals.',
    rows: [
      { cells: ['Dr. Ananya Sharma', 'Academic Excellence Awards 2025', 'Research'], status: 'Under Review', tone: 'warning' },
      { cells: ['Prof. Omar Al Hadi', 'Lifetime Achievement Awards', 'Leadership'], status: 'Shortlisted', tone: 'success' },
      { cells: ['Dr. Mei Lin', 'Young Researcher Awards', 'Innovation'], status: 'New', tone: 'neutral' },
    ],
  },
  {
    id: 'rankings',
    title: 'Rankings',
    subtitle: 'Update institutional rankings, scores, and published ranking order.',
    accent: 'sage',
    actionLabel: 'Add Ranking',
    columns: ['Institution', 'Country', 'Rank', 'Score'],
    helper: 'Use this section to maintain the ranking list shown in the header-driven public pages.',
    rows: [
      { cells: ['IIT Delhi', 'India', '#1'], status: '94.8', tone: 'success' },
      { cells: ['IISc Bengaluru', 'India', '#2'], status: '93.2', tone: 'success' },
      { cells: ['Manipal University Malaysia', 'Malaysia', '#4'], status: '89.7', tone: 'neutral' },
    ],
  },
  {
    id: 'leads',
    title: 'Leads',
    subtitle: 'Review contact enquiries, newsletter signups, and partnership leads.',
    accent: 'crimson',
    actionLabel: 'Review Leads',
    columns: ['Name', 'Email', 'Source', 'Status'],
    helper: 'Track inquiries from public forms and move them through follow-up statuses.',
    rows: [
      { cells: ['Priya Nair', 'priya@university.edu', 'Contact form'], status: 'Open', tone: 'warning' },
      { cells: ['Rahul Desai', 'rahul@research.org', 'Newsletter'], status: 'New', tone: 'neutral' },
      { cells: ['Dr. Fatima', 'fatima@institute.ae', 'Conference inquiry'], status: 'Replied', tone: 'success' },
    ],
  },
];
