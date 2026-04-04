import type { LucideIcon } from 'lucide-react';
import {
  CalendarRange,
  Globe2,
  Medal,
  MessageSquareText,
  MousePointerClick,
  Sparkles,
  Users,
} from 'lucide-react';

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
