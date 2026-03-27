'use client';

import { AnnoatationpluginHome } from '../annotationPlugin/AnnoatationpluginHome';
import { DashboardMetrics } from './DashboardMetrics';
import { DashboardOverview } from './DashboardOverview';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopbar } from './DashboardTopbar';

export function DashboardPage() {
  return (
    <>
    <AnnoatationpluginHome/>
    <div className="min-h-screen bg-app-bg">
      <div className="grid min-h-screen lg:grid-cols-[18rem_minmax(0,1fr)]">
        <DashboardSidebar />

        <div className="min-w-0">
          <DashboardTopbar />
          <div className="px-5 py-5 lg:px-8 lg:py-7">
            <DashboardOverview />
            <DashboardMetrics />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
