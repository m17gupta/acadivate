'use client';

import { DashboardModulePage } from '@/src/components/dashboard/DashboardModulePage';
import { awardsModule } from '@/src/components/dashboard/dashboardModules';

export default function Page() {
  return <DashboardModulePage config={awardsModule} />;
}
