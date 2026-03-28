import { DashboardShell } from '@/src/components/dashboard/DashboardShell';

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <DashboardShell>{children}</DashboardShell>;
}
