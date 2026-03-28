'use client';

import { DashboardModulePage } from '@/src/components/dashboard/DashboardModulePage';
import { leadsModule } from '@/src/components/dashboard/dashboardModules';

export default function Page() {
  return <DashboardModulePage config={leadsModule} />;
}
